import type { UserDto } from "@/core/infrastructure/models/user.model";

export interface LoginResponse {
  token: string,
  type: string,
  usuario: UserDto
}