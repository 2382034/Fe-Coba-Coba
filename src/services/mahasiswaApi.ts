// src/services/mahasiswaApi.ts
import axios from 'axios';
import {
  CreateMahasiswaDto,
  UpdateMahasiswaDto,
  FindMahasiswaQueryDto,
  Prodi,
  Mahasiswa,
  PaginatedMahasiswaResponse,
  // Anda perlu DTO untuk Login di sini jika belum ada
  // misalnya LoginDto, LoginResponseDto
} from '../types/mahasiswa'; // Sesuaikan path jika tipe Login ada di file lain
import { LoginDto, LoginResponseDto } from '../types/auth'; // CONTOH: Asumsi Anda punya file types/auth.ts

console.log('EFFECTIVE VITE_API_URL IN FRONTEND CODE:', import.meta.env.VITE_API_URL);

// VITE_API_URL sekarang adalah root API Anda, yaitu https://.../api
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("FATAL ERROR: VITE_API_URL is not defined! Backend calls will fail.");
  // throw new Error("VITE_API_URL is not defined!"); // Opsional: lempar error saat dev
}

// Instance Axios utama dengan baseURL menunjuk ke root API Anda (yang sudah /api)
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Sekarang baseURL adalah https://.../api
});

// --- Auth API ---
// Asumsi AuthController di backend adalah @Controller('auth')
// dan berada di bawah global prefix /api
export const login = async (credentials: LoginDto): Promise<LoginResponseDto> => {
  // Path lengkap dari root /api
  // Akan menjadi: POST https://.../api/auth/login
  const response = await apiClient.post<LoginResponseDto>('/auth/login', credentials);
  return response.data;
};

// Tambahkan fungsi API otentikasi lainnya di sini (misalnya, register, me, logout)
// export const fetchCurrentUser = async (): Promise<User> => {
//   const response = await apiClient.get<User>('/auth/me');
//   return response.data;
// };

// --- Prodi API ---
// Asumsi DataController di backend adalah @Controller('data')
// dan berada di bawah global prefix /api
export const fetchProdiList = async (): Promise<Prodi[]> => {
  // Path lengkap dari root /api
  // Akan menjadi: GET https://.../api/data/prodi
  const response = await apiClient.get<Prodi[]>('/data/prodi');
  return response.data;
};

// --- Mahasiswa API (di bawah /data) ---
export const fetchMahasiswaList = async (query: FindMahasiswaQueryDto): Promise<PaginatedMahasiswaResponse> => {
  // Path lengkap dari root /api
  // Akan menjadi: GET https://.../api/data/mahasiswa?params...
  const response = await apiClient.get<PaginatedMahasiswaResponse>('/data/mahasiswa', { params: query });
  return response.data;
};

export const fetchMahasiswaById = async (id: number): Promise<Mahasiswa> => {
  // Akan menjadi: GET https://.../api/data/mahasiswa/ID
  const response = await apiClient.get<Mahasiswa>(`/data/mahasiswa/${id}`);
  return response.data;
};

export const createMahasiswa = async (data: CreateMahasiswaDto): Promise<Mahasiswa> => {
  const response = await apiClient.post<Mahasiswa>('/data/mahasiswa', data);
  return response.data;
};

export const updateMahasiswa = async (id: number, data: UpdateMahasiswaDto): Promise<Mahasiswa> => {
  const response = await apiClient.patch<Mahasiswa>(`/data/mahasiswa/${id}`, data);
  return response.data;
};

export const deleteMahasiswa = async (id: number): Promise<void> => {
  await apiClient.delete(`/data/mahasiswa/${id}`);
};

export const uploadMahasiswaFoto = async (id: number, foto: File): Promise<Mahasiswa> => {
  const formData = new FormData();
  formData.append('foto', foto);
  // Akan menjadi: POST https://.../api/data/mahasiswa/ID/foto
  const response = await apiClient.post<Mahasiswa>(`/data/mahasiswa/${id}/foto`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ASUMSI: mahasiswa.foto dari backend adalah URL LENGKAP dari Vercel Blob
export const getMahasiswaFotoUrl = (fotoUrlLengkap: string | null | undefined): string | undefined => {
  return fotoUrlLengkap || undefined; // Atau URL placeholder
};