import { httpClient } from '../http/httpClient';
import { handleApiResponse } from './api.handler';

export interface WalkOwnerResponse {
  idPaseo: number;
  estado: string;
  fechaInicio: string;
  fechaFin: string | null;
  precio: number;
  distanciaKm: number;
  ruta: string;
  observaciones: string;
  idSolicitud: number;
  idPaseador: number;
  calificado: boolean;   
}

class WalksOwnerApi {
  private static instance: WalksOwnerApi;
  private constructor() {}
  static getInstance() {
    if (!WalksOwnerApi.instance) WalksOwnerApi.instance = new WalksOwnerApi();
    return WalksOwnerApi.instance;
  }

  async getWalksByOwner(ownerId: number) {
    const response = await httpClient.get(`/owners/${ownerId}/walks`);
    return handleApiResponse<WalkOwnerResponse[]>(response);
  }
}

export default WalksOwnerApi.getInstance();