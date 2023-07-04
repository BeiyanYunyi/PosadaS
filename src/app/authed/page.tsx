import { setTimeout } from 'timers/promises';

const b64Encode = (str: string) => Buffer.from(str).toString('base64');
const Authorization = `Basic ${b64Encode(
  `${process.env.BAND_CLIENT_ID}:${process.env.BAND_CLIENT_SECRET}`,
)}`;

const AuthedPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const token = await (
    await fetch(
      `https://auth.band.us/oauth2/token?${new URLSearchParams({
        code: searchParams.code as string,
        grant_type: 'authorization_code',
      })}`,
      { headers: { Authorization } },
    )
  ).json();
  return <div>{JSON.stringify(token, null, 2)}</div>;
};

export default AuthedPage;
