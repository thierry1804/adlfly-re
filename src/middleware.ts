import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isStaticSiteAccessActive, verifyStaticSiteAccess } from '@/lib/site-access-static';

const ACCESS_COOKIE = 'adlfly_site_access';

function withoutTokenParam(request: NextRequest): URL {
  const u = request.nextUrl.clone();
  u.searchParams.delete('token');
  return u;
}

export function middleware(request: NextRequest) {
  if (!isStaticSiteAccessActive()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/access-refuse')) {
    return NextResponse.next();
  }

  const urlToken = request.nextUrl.searchParams.get('token');
  const cookieToken = request.cookies.get(ACCESS_COOKIE)?.value;

  if (urlToken) {
    const checked = verifyStaticSiteAccess(urlToken);
    if (checked.ok) {
      const res = NextResponse.redirect(withoutTokenParam(request));
      const maxAge = Math.max(0, Math.floor((checked.cookieExpMs - Date.now()) / 1000));
      res.cookies.set(ACCESS_COOKIE, urlToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge,
      });
      return res;
    }
    const deny = new URL('/access-refuse', request.url);
    if (checked.reason === 'not_yet') {
      deny.searchParams.set('reason', 'not_yet');
    } else if (checked.reason === 'expired') {
      deny.searchParams.set('reason', 'expired');
    } else {
      deny.searchParams.set('reason', 'invalid');
    }
    return NextResponse.redirect(deny);
  }

  if (cookieToken) {
    const checked = verifyStaticSiteAccess(cookieToken);
    if (checked.ok) {
      return NextResponse.next();
    }
    const res = NextResponse.redirect(
      new URL(
        `/access-refuse?reason=${
          checked.reason === 'expired'
            ? 'expired'
            : checked.reason === 'not_yet'
              ? 'not_yet'
              : 'invalid'
        }`,
        request.url,
      ),
    );
    res.cookies.delete(ACCESS_COOKIE);
    return res;
  }

  return NextResponse.redirect(new URL('/access-refuse?reason=missing', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
