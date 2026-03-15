import Amadeus from 'amadeus';

let amadeus: any;

export const getAmadeusClient = () => {
  if (!amadeus) {
    amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
      hostname: process.env.AMADEUS_HOSTNAME || 'test'
    });
  }
  return amadeus;
};
