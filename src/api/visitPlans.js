// Dalam mode development, Vite mem-proxy /api ke backend NestJS port 3000.
// Untuk server lain, isi VITE_API_BASE_URL (contoh: http://localhost:3000).
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

async function request(path = '', options = {}) {
  let response
  try {
    response = await fetch(`${apiBaseUrl}/visit-plans${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error('Tidak bisa terhubung ke backend. Pastikan NestJS berjalan pada port 3000.')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(' · ')
      : data?.message
    throw new Error(message || `Permintaan gagal (HTTP ${response.status}).`)
  }
  return data
}

export const getVisitPlans = () => request()
export const addVisitPlan = (data) => request('', { method: 'POST', body: JSON.stringify(data) })
export const editVisitPlan = (id, data) => request(`/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(data) })
export const deleteVisitPlan = (id) => request(`/${encodeURIComponent(id)}`, { method: 'DELETE' })
