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
  fechaSolicitud: string
  estado: string
  horaSugerida: string
  puntoEncuentro: string
  cantidadPerros: number
  observaciones: string
  idDueno: number
  idPaseador: number
}

class SolicitudApi {
  private static instance: SolicitudApi;
  private constructor() {}
  static getInstance() {
    if (!SolicitudApi.instance) SolicitudApi.instance = new SolicitudApi();
    return SolicitudApi.instance;
  }

  async createSolicitud(ownerId: number, data: CreateSolicitudPayload) {
    const response = await httpClient.post(`/owners/${ownerId}/requests`, data);
    return handleApiResponse<SolicitudResponse>(response);
  }

  async getByOwnerId(ownerId: number) {
    const response = await httpClient.get(`/owners/${ownerId}/requests`);
    return handleApiResponse<SolicitudResponse[]>(response);
  }
}

export default SolicitudApi.getInstance();