// src/pages/EditData.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import MahasiswaForm, { MahasiswaFormData } from '../components/MahasiswaForm';
import { api } from '../services/mahasiswaApi'; // DIUBAH: Mengimpor objek 'api'
import { UpdateMahasiswaDto, Mahasiswa } from '../types/mahasiswa';

const EditDataMahasiswaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const mahasiswaId = parseInt(id!, 10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: initialData, isLoading: isLoadingMahasiswa, isError, error } = useQuery<Mahasiswa, Error>({
    queryKey: ['mahasiswa', mahasiswaId],
    // DIUBAH: Pemanggilan fungsi melalui objek api
    queryFn: () => api.mahasiswa.getById(mahasiswaId),
    enabled: !!mahasiswaId,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id: mhsId, formData }: { id: number; formData: MahasiswaFormData }) => {
      const updateDto: UpdateMahasiswaDto = {
        nama: formData.nama,
        nim: formData.nim,
        prodi_id: formData.prodi_id,
        alamat: formData.alamat.jalan || formData.alamat.kota || formData.alamat.provinsi || formData.alamat.kode_pos
          ? {
              jalan: formData.alamat.jalan,
              kota: formData.alamat.kota,
              provinsi: formData.alamat.provinsi,
              kode_pos: formData.alamat.kode_pos,
            }
          : null,
      };

      // DIUBAH: Pemanggilan fungsi melalui objek api
      const updatedMahasiswa = await api.mahasiswa.update(mhsId, updateDto);

      if (formData.fotoFile && formData.fotoFile.length > 0) {
        try {
          // DIUBAH: Pemanggilan fungsi melalui objek api
          await api.mahasiswa.uploadFoto(updatedMahasiswa.id, formData.fotoFile[0]);
        } catch (uploadError) {
          toast.error('Data mahasiswa diupdate, tapi gagal upload foto baru.');
          console.error("Foto upload failed during update:", uploadError);
        }
      }
      return updatedMahasiswa;
    },
    onSuccess: (updatedMahasiswa) => {
      toast.success('Mahasiswa berhasil diperbarui!');
      queryClient.invalidateQueries({ queryKey: ['mahasiswaList'] });
      queryClient.invalidateQueries({ queryKey: ['mahasiswa', updatedMahasiswa.id] });
      navigate(`/data-mahasiswa/${updatedMahasiswa.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui mahasiswa.');
    },
  });

  const handleSubmit = (data: MahasiswaFormData) => {
    if (!mahasiswaId) return;
    updateMutation.mutate({ id: mahasiswaId, formData: data });
  };

  if (isLoadingMahasiswa) return <div className="text-center p-10">Memuat data mahasiswa...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Error: {error?.message || 'Gagal memuat data untuk diedit.'}</div>;
  if (!initialData) return <div className="text-center p-10">Data mahasiswa tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Edit Mahasiswa</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Kembali
          </button>
        </div>
        <MahasiswaForm
          onSubmit={handleSubmit}
          initialData={initialData || null}
          isSubmitting={updateMutation.isPending}
          submitButtonText="Simpan Perubahan"
        />
      </div>
    </div>
  );
};

export default EditDataMahasiswaPage;
