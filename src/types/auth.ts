// src/types/auth.ts

/**
 * Struktur data yang dikirim dari form login ke backend.
 */
export interface LoginDto {
    username: string; // Bisa juga email, sesuaikan dengan backend
    password: string;
  }
  
  /**
   * Struktur data yang diterima dari backend setelah login berhasil.
   */
  export interface LoginResponseDto {
    accessToken: string;
    user: {
      id: number | string;
      username: string;
      role: string;
    };
  }
  
  /**
   * Struktur data untuk registrasi pengguna baru.
   */
  export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    role: 'Admin' | 'User'; // Sesuaikan dengan role yang ada
  }