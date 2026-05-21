import { httpClient } from "../http/httpClient";
import { handleApiResponse } from "./api.handler";

export interface PaseoResponse {
  idPaseo: number
  estado: string
  fechaInicio: string
  fechaFin: string
  precio: number
  distancia: number
  ruta: string
  observaciones: string
  idSolicitud: number
  idPaseador: number
}

class PaseoService {
  private static instance: PaseoService;
  private constructor() {}
  static getInstance() {
    if (!PaseoService.instance) PaseoService.instance = new PaseoService();
    return PaseoService.instance;
  }

  async getWalksByWalker (walkerId: number) {
    const response = await httpClient.get(`/paseador/${walkerId}/walks`)
    return handleApiResponse<PaseoResponse[]>(response)
  }

  async endWalk (walkerId: number, walkId: number) {
    await httpClient.patch(`/paseador/${walkerId}/walks/${walkId}/finish`)
  }
}

export default PaseoService.getInstance()