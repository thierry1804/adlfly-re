declare module "amadeus" {
  interface AmadeusConfig {
    clientId?: string;
    clientSecret?: string;
    hostname?: string;
  }

  export default class Amadeus {
    constructor(config: AmadeusConfig);
    shopping: {
      flightOffersSearch: { get: (params: Record<string, unknown>) => Promise<unknown> };
    };
    referenceData: {
      locations: {
        get: (params: Record<string, unknown>) => Promise<unknown>;
        cities: {
          get: (params: Record<string, unknown>) => Promise<unknown>;
        };
      };
    };
  }
}
