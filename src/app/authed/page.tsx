import { IAuthResponse, IGetBandsResponse } from '../types/band';
import prisma from '../utils/database';

const b64Encode = (str: string) => Buffer.from(str).toString('base64');
const Authorization = `Basic ${b64Encode(
  `${process.env.BAND_CLIENT_ID}:${process.env.BAND_CLIENT_SECRET}`,
)}`;

const AuthedPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const authResponse: IAuthResponse = await (
    await fetch(
      `https://auth.band.us/oauth2/token?${new URLSearchParams({
        code: searchParams.code as string,
        grant_type: 'authorization_code',
      })}`,
      { headers: { Authorization } },
    )
  ).json();
  const getBandsResponse: IGetBandsResponse = await (
    await fetch(
      `https://openapi.band.us/v2.1/bands?${new URLSearchParams({
        access_token: authResponse.access_token,
      })}`,
    )
  ).json();
  const { bands } = getBandsResponse.result_data;
  let tier = 0;
  if (bands.map((band) => band.name).includes(process.env.TIER1_BAND!)) {
    tier = 1;
  }
  let user;
  const userInDb = await prisma.user.findUnique({ where: { userKey: authResponse.user_key } });
  if (userInDb) {
    user = await prisma.user.update({
      where: { userKey: authResponse.user_key },
      data: { tier },
    });
  } else {
    user = await prisma.user.create({ data: { userKey: authResponse.user_key, tier } });
  }

  return <div>{JSON.stringify(user, null, 2)}</div>;
};

export default AuthedPage;
