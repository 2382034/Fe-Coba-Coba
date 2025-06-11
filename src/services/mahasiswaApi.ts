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
import { LoginDto, LoginResponseDto, RegisterDto } from '../types/auth';

console.log('EFFECTIVE VITE_API_URL IN FRONTEND CODE:', import.meta.env.VITE_API_URL);

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("FATAL ERROR: VITE_API_URL is not defined! Backend calls will fail.");
}

// Instance Axios utama, baseURL sudah menunjuk ke root API (misal: https://.../api)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Objek terpusat untuk semua panggilan API ke backend.
 * Dikelompokkan berdasarkan resource (auth, mahasiswa, prodi).
 */
export const api = {
  // --- Auth Endpoints ---
  auth: {
    login: async (credentials: LoginDto): Promise<LoginResponseDto> => {
      // Path: /auth/login
      const response = await apiClient.post<LoginResponseDto>('/auth/login', credentials);
      return response.data;
    },
    register: async (data: RegisterDto): Promise<any> => { // Ganti 'any' dengan DTO respons registrasi jika ada
      // Path: /auth/register
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    },
    // Anda bisa tambahkan fungsi lain di sini, contoh:
    // getCurrentUser: async (): Promise<User> => {
    //   const response = await apiClient.get<User>('/auth/me');
    //   return response.data;
    // }
  },

  // --- Prodi Endpoints ---
  prodi: {
    getAll: async (): Promise<Prodi[]> => {
      // Path: /data/prodi
      const response = await apiClient.get<Prodi[]>('/data/prodi');
      return response.data;
    },
    // Tambahkan fungsi lain jika perlu (getById, create, update, delete)
  },

  // --- Mahasiswa Endpoints ---
  mahasiswa: {
    getAll: async (query: FindMahasiswaQueryDto): Promise<PaginatedMahasiswaResponse> => {
      // Path: /data/mahasiswa
      const response = await apiClient.get<PaginatedMahasiswaResponse>('/data/mahasiswa', { params: query });
      return response.data;
    },
    getById: async (id: number): Promise<Mahasiswa> => {
      // Path: /data/mahasiswa/{id}
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

  // Fungsi utilitas untuk mendapatkan URL foto (tidak berubah)
  utils: {
    getMahasiswaFotoUrl: (fotoUrlLengkap: string | null | undefined): string | undefined => {
      return fotoUrlLengkap || undefined; // Atau URL placeholder
    },
  },
};
