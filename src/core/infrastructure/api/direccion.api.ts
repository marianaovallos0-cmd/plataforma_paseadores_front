// src/core/infrastructure/api/direccion.api.ts
import { httpClient } from '../http/httpClient';
import { handleApiResponse } from './api.handler';

export interface DireccionPayload {
  detalle: string;
  barrio: string;
  ciudad: string;
  latitud?: number;
  longitud?: number;
}

class DireccionApi {
  private static instance: DireccionApi;
  private constructor() {}
  static getInstance() {
    if (!DireccionApi.instance) DireccionApi.instance = new DireccionApi();
    return DireccionApi.instance;
  }

  async createDireccion(userId: number, data: DireccionPayload) {
    const token = localStorage.getItem('token');
    const response = await httpClient.post(`/owners/${userId}/direcciones`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleApiResponse<any>(response);
  }

  async findByUserId(userId: number) {
    const token = localStorage.getItem('token');
    const response = await httpClient.get(`/owners/${userId}/direcciones`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleApiResponse<any[]>(response);
  }
}

export default DireccionApi.getInstance();