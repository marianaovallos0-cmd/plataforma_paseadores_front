import { httpClient } from '../http/httpClient';
import { handleApiResponse } from './api.handler';

export interface CreateSolicitudPayload {
  horaSugerida: string;     // formato "HH:MM:SS"
  puntoEncuentro: string;
  observaciones: string;
  idPaseador: number;       // por ahora puedes poner un id fijo de algún paseador
  perros: number[];         // array de ids de perros
}

export interface SolicitudResponse {
  idSolicitud: number;
  // ... otros campos que devuelva el backend
}

class SolicitudApi {
  private static instance: SolicitudApi;
  private constructor() {}
  static getInstance() {
    if (!SolicitudApi.instance) SolicitudApi.instance = new SolicitudApi();
    return SolicitudApi.instance;
  }

  async createSolicitud(ownerId: number, data: CreateSolicitudPayload) {
    const token = localStorage.getItem('token');
    const response = await httpClient.post(`/owners/${ownerId}/requests`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleApiResponse<SolicitudResponse>(response);
  }
}

export default SolicitudApi.getInstance();