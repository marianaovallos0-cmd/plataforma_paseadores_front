import { httpClient } from '../http/httpClient';
import { handleApiResponse } from './api.handler';

export interface CreateCalificacionPayload {
  puntaje: number;
  comentario: string;
}

class CalificacionApi {
  private static instance: CalificacionApi;
  private constructor() {}
  static getInstance() {
    if (!CalificacionApi.instance) CalificacionApi.instance = new CalificacionApi();
    return CalificacionApi.instance;
  }

  async calificarPaseo(ownerId: number, walkId: number, data: CreateCalificacionPayload) {
    const token = localStorage.getItem('token');
    const response = await httpClient.post(`/owners/${ownerId}/walks/${walkId}/ratings`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleApiResponse<any>(response);
  }
}

export default CalificacionApi.getInstance();