import { httpClient } from '../http/httpClient';
import { handleApiResponse } from './api.handler';

export interface Pet {
  idPerro: number;
  nombre: string;
  raza: string;
  edad: number;
  peso: number;
  observaciones: string;
  foto: string;
  idDueno: number;
}

export interface CreatePetPayload {
  nombre: string;
  raza: string;
  edad: number;
  peso: number;
  observaciones: string;
  foto?: string;
}

class PetApi {
  private static instance: PetApi;
  private constructor() {}
  static getInstance() {
    if (!PetApi.instance) PetApi.instance = new PetApi();
    return PetApi.instance;
  }

  async getPetsByOwner(ownerId: number) {
    const token = localStorage.getItem('token');
    const response = await httpClient.get(`/owners/${ownerId}/pets`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleApiResponse<Pet[]>(response);
  }

  async createPet(ownerId: number, pet: CreatePetPayload) {
    const token = localStorage.getItem('token');
    const response = await httpClient.post(`/owners/${ownerId}/pets`, pet, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleApiResponse<Pet>(response);
  }
}

export default PetApi.getInstance();