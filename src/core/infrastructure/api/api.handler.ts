import type { ApiResponse } from "@/core/types/api.types";
import type { AxiosResponse } from "axios";
import { ApiException } from "../exceptions/api.exception";

export function handleApiResponse<T>(
  response: AxiosResponse<ApiResponse<T>>
): T {

  const body = response.data;

  if (!body.success) {

    throw new ApiException(
      body.error.message,
      body.error.code,
      body.error.details
    );
  }

  return body.data;
}