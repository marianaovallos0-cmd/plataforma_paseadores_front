import { httpClient } from "../http/httpClient";
import type { LoginPayload } from "../http/types/login-payload.type";
import type { RegisterPayload } from "../http/types/register-payload.type";
import type { LoginResponse } from "../http/types/response/login-response";
import { UserDto } from "../models/user.model";
import { handleApiResponse } from "./api.handler";

class AuthApi {
  private static instance: AuthApi

  private constructor() {}

  static getInstance() {
    if(!AuthApi.instance) {
      AuthApi.instance = new AuthApi()
    }

    return AuthApi.instance
  }

  async login(payload: LoginPayload) {
    const response = await httpClient.post("/auth/login", payload)
    return handleApiResponse<LoginResponse>(
      response
    );
  }

  async register(payload: RegisterPayload) {
    const response = await httpClient.post("/auth/register", payload)
    return handleApiResponse<UserDto>(
      response
    );
  }
}

export default AuthApi.getInstance()