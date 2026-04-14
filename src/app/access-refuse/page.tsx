type Props = {
  searchParams: Promise<{ reason?: string }>;
};

const messages: Record<string, { title: string; body: string }> = {
  missing: {
    title: 'Accès non autorisé',
    body: 'Ce site est protégé. Utilisez le lien qui vous a été communiqué.',
  },
  invalid: {
    title: 'Lien invalide',
    body: 'Le jeton fourni est incorrect ou a été modifié.',
  },
  not_yet: {
    title: 'Lien pas encore actif',
    body: 'Ce lien temporaire n’est pas encore valide. Réessayez à partir de la date prévue.',
  },
  expired: {
    title: 'Lien expiré',
    body: 'La période d’accès autorisée est terminée. Demandez un nouveau lien si besoin.',
  },
};

export default async function AccessRefusePage({ searchParams }: Props) {
  const { reason } = await searchParams;
  const key =
    reason === 'expired' || reason === 'invalid' || reason === 'not_yet' ? reason : 'missing';
  const { title, body } = messages[key] ?? messages.missing;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-muted-foreground">{body}</p>
      <p className="mt-8 text-sm text-muted-foreground">
        Besoin d’aide ?{' '}
        <a
          href="mailto:contact@adlfly.re"
          className="text-primary underline-offset-4 hover:underline"
        >
          contact@adlfly.re
        </a>
      </p>
    </main>
  );
}
