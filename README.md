# Jelajah Banyumas — Tugas 9 NestJS Dasar + MVC

**Jelajah Banyumas** merupakan website informasi destinasi wisata dan kuliner di Kabupaten Banyumas yang dibangun menggunakan **React + Vite**. Pada Tugas 9 ditambahkan backend **NestJS** untuk mengelola **Rencana Kunjungan** lewat REST API. Halaman beranda, katalog, detail wisata/kuliner, dan desain frontend lama tetap dipertahankan.

## Teknologi

- **Frontend**: React, React Router, Vite.
- **Backend**: NestJS, TypeScript, struktur **Module → Controller → Service → Entity/DTO** (pola MVC pada materi kuliah).
- **Penyimpanan**: array dalam memori backend (tanpa database, sesuai instruksi tugas). **Data hilang saat backend dihentikan/direstart.**
- **Validasi**: `class-validator`, DTO, `ValidationPipe` global.

## Menjalankan di VS Code (Windows / PowerShell)

**Syarat:** Node.js yang kompatibel dengan Vite 8 dan NestJS 11 (disarankan Node.js 22 LTS), npm, dan koneksi internet untuk instalasi pertama.

1. Ekstrak ZIP, lalu buka folder `Jelajah-Banyumas-Tugas9` di VS Code.
2. Di **Terminal 1**, jalankan backend:

   ```powershell
   cd backend
   npm install
   npm run start:dev
   ```

   Backend: <http://localhost:3000/visit-plans>

3. Di **Terminal 2** (terminal baru dari folder utama proyek), jalankan frontend:

   ```powershell
   npm install
   npm run dev
   ```

   Frontend: <http://localhost:5173> → menu **Rencana kunjungan**.

> Jangan menjalankan `npm run dev` di folder `backend`, atau `npm run start:dev` di folder utama. Keduanya harus berjalan bersamaan.

Frontend mengakses `/api/visit-plans` yang diteruskan oleh proxy Vite ke NestJS `http://localhost:3000/visit-plans`. CORS juga diaktifkan untuk localhost:5173. Jika frontend dipasang di host lain, gunakan `VITE_API_BASE_URL` saat build.

## Resource `visit-plans`

Resource mengikuti struktur yang dihasilkan Nest CLI (`nest g resource visit-plans`, REST API) dan diimplementasikan pada `backend/src/visit-plans/`:

| Komponen | Lokasi / fungsi |
|---|---|
| Entity | `entities/visit-plan.entity.ts`, tipe data utama |
| DTO | `dto/create-visit-plan.dto.ts` dan `dto/update-visit-plan.dto.ts` |
| Controller | `visit-plans.controller.ts`, menerima request HTTP; service via dependency injection |
| Service | `visit-plans.service.ts`, CRUD dengan array dalam memori |
| Module | `visit-plans.module.ts`, mendaftarkan controller dan service |

Field Entity: `id` (string/UUID), `name` (string), `destinationId` (string), `destinationName` (string), `visitDate` (string tanggal ISO), `participantCount` (number), `isCompleted` (boolean), `createdAt` (string ISO).

Aturan validasi DTO: nama string minimal 3 karakter, maksimal 100; destinasi wajib ada; tanggal ISO `YYYY-MM-DD`; peserta bilangan bulat minimal 1; status harus boolean. `UpdateVisitPlanDto` menggunakan `PartialType()` agar field opsional saat PATCH. `ValidationPipe` global menghapus/menolak field tidak dikenal.

Skenario error: `NotFoundException` (HTTP **404** ketika ID tidak ditemukan), `ConflictException` (HTTP **409** ketika nama + destinasi + tanggal sama), serta `ValidationPipe` (HTTP **400** untuk data salah).

## REST API

| Method | URL | Keterangan | Status normal |
|---|---|---|---|
| `GET` | `/visit-plans` | Ambil semua rencana | 200 |
| `GET` | `/visit-plans/:id` | Ambil satu rencana | 200 |
| `POST` | `/visit-plans` | Tambah rencana | 201 |
| `PATCH` | `/visit-plans/:id` | Perbarui rencana | 200 |
| `DELETE` | `/visit-plans/:id` | Hapus rencana | 200 |

Contoh body untuk `POST`:

```json
{
  "name": "Liburan Akhir Pekan",
  "destinationId": "baturraden",
  "destinationName": "Lokawisata Baturraden",
  "visitDate": "2027-01-20",
  "participantCount": 2,
  "isCompleted": false
}
```

## Pengujian dengan REST Client (wajib untuk tugas)

1. Pasang extension VS Code **REST Client** (Huachao Mao / `humao.rest-client`).
2. Jalankan backend, lalu buka `backend/requests.http`.
3. Klik **Send Request** satu per satu. Jalankan **POST** sebelum GET detail/PATCH/DELETE, karena request berikutnya mengambil ID dari respons POST secara otomatis.
4. Untuk screenshot HTTP 409, jalankan **POST yang sama dua kali sebelum PATCH**. Lihat urutan dan keterangan di file `.http`.
5. Simpan screenshot asli panel **request + response + status HTTP** ke `docs/screenshots/` (petunjuk ada di dalam folder tersebut).

Pengujian tambahan (opsional, di terminal `backend/`):

```powershell
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run build
```

## Alur CRUD frontend ↔ backend

1. Buka menu **Rencana kunjungan** dan masukkan nama, destinasi, tanggal, jumlah peserta, status.
2. Klik **Tambah Rencana** → React mengirim `POST` → NestJS memvalidasi dan menyimpan ke array → card muncul.
3. Klik **Edit** → ubah isian → **Simpan Perubahan** → `PATCH` → card diperbarui.
4. Klik **Hapus** → `DELETE` → card menghilang.
5. Refresh halaman selama backend **masih berjalan** → `GET` memuat data kembali. Jika backend direstart, data reset karena tidak ada database.

## Dokumentasi / screenshot untuk pengumpulan

Letakkan screenshot *asli* hasil menjalankan aplikasi di `docs/screenshots/`. Daftar screenshot yang diperlukan ada di [`docs/screenshots/README.md`](docs/screenshots/README.md). Contoh screenshot REST Client belum disertakan karena harus diambil dari pengujian nyata pada komputer pengumpul.

**Pengumpulan:** push frontend dan backend ke satu repository GitHub, pastikan README dan screenshot ikut ter-upload, kemudian kumpulkan **link repository** melalui LMS (bukan ZIP, kecuali ada instruksi lain dari dosen).

## Struktur proyek

```text
Jelajah-Banyumas-Tugas9/
├── src/                 # frontend React asli dan integrasi REST API
│   ├── api/visitPlans.js
│   └── components/VisitPlanList.jsx, VisitPlanCard.jsx
├── backend/
│   ├── src/visit-plans/ # Entity, DTO, Controller, Service, Module
│   ├── requests.http    # pengujian GET/POST/PATCH/DELETE + error
│   └── test/            # tes integrasi HTTP
├── docs/screenshots/    # tempat SS asli untuk laporan
├── package.json         # frontend
└── README.md
```

> **Catatan**: ZIP hasil revisi tidak menyertakan folder `.git`, `node_modules`, atau `dist` agar aman dan ringan. Proyek ini **belum dipush ke akun GitHub mana pun**. Jalankan `npm install` secara terpisah di root dan `backend` setelah ekstrak.
