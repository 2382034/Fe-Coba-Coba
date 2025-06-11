// src/pages/AddData.tsx
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MahasiswaForm, { MahasiswaFormData } from '../components/MahasiswaForm';
import { api } from '../services/mahasiswaApi'; // DIUBAH: Mengimpor objek 'api'
import { CreateMahasiswaDto } from '../types/mahasiswa';

const AddDataMahasiswaPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (formData: MahasiswaFormData) => {
      if (formData.prodi_id === null) {
        throw new Error("Prodi ID tidak boleh null saat membuat mahasiswa baru.");
      }
      const createDto: CreateMahasiswaDto = {
        nama: formData.nama,
        nim: formData.nim,
        prodi_id: formData.prodi_id,
        alamat: {
          jalan: '',
          kota: '',
          provinsi: '',
          kode_pos: ''
        },
      };

      // DIUBAH: Pemanggilan fungsi melalui objek api
      const newMahasiswa = await api.mahasiswa.create(createDto);

      if (formData.fotoFile && formData.fotoFile.length > 0) {
        try {
          // DIUBAH: Pemanggilan fungsi melalui objek api
          await api.mahasiswa.uploadFoto(newMahasiswa.id, formData.fotoFile[0]);
        } catch (uploadError) {
          toast.error('Mahasiswa dibuat, tapi gagal upload foto. Anda bisa menguploadnya di halaman edit.');
          console.error("Foto upload failed after creation:", uploadError);
        }
      }
      return newMahasiswa;
    },
    onSuccess: () => {
      toast.success('Mahasiswa berhasil ditambahkan!');
      // DIUBAH: Gunakan queryKey yang lebih spesifik jika memungkinkan, agar tidak invalidate semua list
      queryClient.invalidateQueries({ queryKey: ['mahasiswaList'] });
      navigate('/data-mahasiswa');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menambahkan mahasiswa.');
      console.error("Error creating mahasiswa:", error);
    },
  });

  const handleSubmit = (data: MahasiswaFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Tambah Mahasiswa Baru</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Kembali
          </button>
        </div>
        <MahasiswaForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitButtonText="Tambah Mahasiswa"
        />
      </div>
    </div>
  );
};

export default AddDataMahasiswaPage;
