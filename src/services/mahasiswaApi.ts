// src/services/mahasiswaApi.ts
import axios from 'axios';
import {
  CreateMahasiswaDto,
  UpdateMahasiswaDto,
  FindMahasiswaQueryDto,
  Prodi,
  Mahasiswa,
  PaginatedMahasiswaResponse,
} from '../types/mahasiswa';
// DIUBAH: Menggunakan nama tipe AuthResponseDto yang akan kita standarkan
import { LoginDto, AuthResponseDto, RegisterDto } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("FATAL ERROR: VITE_API_URL is not defined! Backend calls will fail.");
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const api = {
  auth: {
    // DIUBAH: Menggunakan tipe AuthResponseDto sebagai hasil
    login: async (credentials: LoginDto): Promise<AuthResponseDto> => {
      const response = await apiClient.post<AuthResponseDto>('/auth/login', credentials);
      return response.data;
    },
    register: async (data: RegisterDto): Promise<any> => {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    },
  },

  prodi: {
    getAll: async (): Promise<Prodi[]> => {
      const response = await apiClient.get<Prodi[]>('/data/prodi');
      return response.data;
    },
  },

  mahasiswa: {
    getAll: async (query: FindMahasiswaQueryDto): Promise<PaginatedMahasiswaResponse> => {
      const response = await apiClient.get<PaginatedMahasiswaResponse>('/data/mahasiswa', { params: query });
      return response.data;
    },
    getById: async (id: number): Promise<Mahasiswa> => {
      const response = await apiClient.get<Mahasiswa>(`/data/mahasiswa/${id}`);
      return response.data;
    },
    create: async (data: CreateMahasiswaDto): Promise<Mahasiswa> => {
      const response = await apiClient.post<Mahasiswa>('/data/mahasiswa', data);
      return response.data;
    },
    update: async (id: number, data: UpdateMahasiswaDto): Promise<Mahasiswa> => {
      const response = await apiClient.patch<Mahasiswa>(`/data/mahasiswa/${id}`, data);
      return response.data;
    },
    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/data/mahasiswa/${id}`);
    },
    uploadFoto: async (id: number, foto: File): Promise<Mahasiswa> => {
      const formData = new FormData();
      formData.append('foto', foto);
      const response = await apiClient.post<Mahasiswa>(`/data/mahasiswa/${id}/foto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  },

  utils: {
    getMahasiswaFotoUrl: (fotoUrlLengkap: string | null | undefined): string | undefined => {
      return fotoUrlLengkap || undefined;
    },
  },
};
