import type { ILoginResponse } from '../../../types/LoginResponse';
import type { IUser } from '../../../types/User';
import type { ILoginPayload } from '../types/loginPayload';

export interface IAuthService {
  login(payload: ILoginPayload): Promise<ILoginResponse>;
  getCurrentUser(signal?: AbortSignal): Promise<IUser>;
}
