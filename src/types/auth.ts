// src/types/auth.ts

// Tipe data untuk dikirim ke API saat login
export interface LoginDto {
    username: string;
    password: string;
  }
  
  // Tipe data untuk dikirim ke API saat registrasi
  export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    role: 'Admin' | 'User';
  }
  
  // Tipe data untuk objek user yang sudah terautentikasi.
  // Ini adalah tipe yang akan digunakan di seluruh aplikasi (misalnya di AuthContext).
  export interface AuthenticatedUser {
    id: number | string;
    username: string;
    email: string;
    role: string;
  }
  
  // Tipe data untuk respons lengkap dari API setelah login/register berhasil.
  export interface AuthResponseDto {
    accessToken: string;
    user: AuthenticatedUser; // Menggunakan tipe yang sudah didefinisikan di atas
  }
  
