import Amadeus from 'amadeus';

let amadeus: Amadeus;

export const getAmadeusClient = () => {
  if (!amadeus) {
    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new Error('Amadeus credentials missing: AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET must be set');
    }
    amadeus = new Amadeus({
      clientId,
      clientSecret,
      hostname: process.env.AMADEUS_HOSTNAME || 'test'
    });
  }
  return amadeus;
};
