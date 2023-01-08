import axios from 'axios';
import IPolygonApiResponse from './Interfaces/IPolygonApiResponse';

export default async function requestDataFromPolygon(
  tokenName: string
): Promise<IPolygonApiResponse | null> {
  //let result;
  const options = {
    method: 'POST',
    url: `https://api.zettablock.com/api/v1/dataset/${process.env.ZETTABLOCK_API_ID}/graphql`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-API-KEY': process.env.ZETTABLOCK_API_KEY,
    },
    data: {
      query: `
            {
                record(name:"${tokenName}") {
                  
                  contract_address,
                  name,
                  symbol,
                  standard,
                  process_time

                }
            }
            `,
    },
  };

  const data = await axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });

  return data.data.record;
}
