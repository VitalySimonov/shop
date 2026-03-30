import { apiClient } from '../apiClient';
import type { ILoginResponse } from '../../../types/LoginResponse';
import type { IUser } from '../../../types/User';
import type { IAuthService } from '../interfaces/authService.interface';
import type { ILoginPayload } from '../types/loginPayload';

export const authService: IAuthService = {
  async login(payload: ILoginPayload) {
    return apiClient<ILoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...payload, expiresInMins: 60 }),
    });
  },
  async getCurrentUser(signal?: AbortSignal) {
    return apiClient<IUser>('/auth/me', {
      auth: true,
      signal,
    });
  },
} satisfies IAuthService;

export const login = authService.login.bind(authService);
export const getCurrentUser = authService.getCurrentUser.bind(authService);
