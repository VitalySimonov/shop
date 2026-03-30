import type { IUser } from './User';

export interface ILoginResponse extends IUser {
  accessToken: string;
  refreshToken: string;
}
