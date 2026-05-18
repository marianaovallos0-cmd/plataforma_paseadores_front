
import { env } from "@/core/config/env"
import axios from "axios"

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json"
  }
})