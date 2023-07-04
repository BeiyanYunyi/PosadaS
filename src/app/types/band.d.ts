interface IBaseResponse {
  result_code: 1;
}

export interface IAuthResponse {
  access_token: string;
  token_type: 'bearer';
  refresh_token: string;
  expires_in: number;
  scope: string;
  user_key: string;
}

interface IBand {
  name: string;
  cover: string;
  member_count: number;
  band_key: string;
}

export interface IGetBandsResponse extends IBaseResponse {
  result_data: { bands: IBand[] };
}
