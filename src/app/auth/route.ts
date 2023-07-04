import { redirect } from 'next/navigation';

const params = {
  response_type: 'code',
  client_id: process.env.BAND_CLIENT_ID!,
  redirect_uri: `${process.env.SERVE_URL}/authed`,
};

export const GET = async () => {
  redirect(`https://auth.band.us/oauth2/authorize?${new URLSearchParams(params)}`);
};
