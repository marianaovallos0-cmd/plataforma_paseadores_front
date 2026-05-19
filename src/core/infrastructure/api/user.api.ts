import { httpClient } from '../http/httpClient';
import { handleApiResponse } from './api.handler';
import type { UserDto } from '../models/user.model';

class UserApi {
  private static instance: UserApi;
  private constructor() {}
  static getInstance() {
    if (!UserApi.instance) UserApi.instance = new UserApi();
    return UserApi.instance;
  }

  async getCurrentUser() {
  const token = localStorage.getItem('token');
  const response = await httpClient.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return handleApiResponse<UserDto>(response);
}

  async updateUser(userId: number, data: Partial<UserDto>) {
    const response = await httpClient.put(`/users/${userId}`, data);
    return handleApiResponse<UserDto>(response);
  }
}

export default UserApi.getInstance();