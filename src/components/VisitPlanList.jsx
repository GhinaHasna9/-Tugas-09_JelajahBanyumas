import { useState } from 'react'
import SectionHeading from './SectionHeading.jsx'
import VisitPlanCard from './VisitPlanCard.jsx'

function getLocalDateString() {
  const date = new Date()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function VisitPlanList({ items, plans, isLoading, loadError, onAddPlan, onUpdatePlan, onDeletePlan }) {
  const [planName, setPlanName] = useState('')
  const [destinationId, setDestinationId] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [participantCount, setParticipantCount] = useState('1')
  const [isCompleted, setIsCompleted] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const today = getLocalDateString()
  const isBusy = isLoading || isSubmitting || deletingId !== null

  function resetForm() {
    setPlanName('')
    setDestinationId('')
    setVisitDate('')
    setParticipantCount('1')
    setIsCompleted(false)
    setEditingId(null)
    setErrors({})
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isBusy) return

    const nextErrors = {}
    const selectedDestination = items.find((item) => item.id === destinationId)
    const count = Number(participantCount)

    if (planName.trim().length < 3) nextErrors.planName = 'Nama harus minimal 3 karakter.'
    if (!selectedDestination) nextErrors.destinationId = 'Pilih destinasi wisata.'
    if (!visitDate) nextErrors.visitDate = 'Tanggal kunjungan wajib diisi.'
    else if (visitDate < today) nextErrors.visitDate = 'Tanggal kunjungan tidak boleh sebelum hari ini.'
    if (!Number.isInteger(count) || count < 1) nextErrors.participantCount = 'Jumlah peserta minimal 1.'

    setErrors(nextErrors)
    setRequestError('')
    setSuccessMessage('')
    if (Object.keys(nextErrors).length) return

    const payload = {
      name: planName.trim(),
      destinationId,
      destinationName: selectedDestination.name,
      visitDate,
      participantCount: count,
      isCompleted,
    }

    setIsSubmitting(true)
    try {
      if (editingId) {
        await onUpdatePlan(editingId, payload)
        setSuccessMessage('Rencana kunjungan berhasil diperbarui.')
      } else {
        await onAddPlan(payload)
        setSuccessMessage('Rencana kunjungan berhasil ditambahkan.')
      }
      resetForm()
    } catch (error) {
      setRequestError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleFieldChange(field, setter) {
    return (event) => {
      setter(event.target.value)
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
      setRequestError('')
      setSuccessMessage('')
    }
  }

  function handleEditPlan(plan) {
    if (isBusy) return
    setEditingId(plan.id)
    setPlanName(plan.name)
    setDestinationId(plan.destinationId)
    setVisitDate(plan.visitDate)
    setParticipantCount(String(plan.participantCount))
    setIsCompleted(plan.isCompleted)
    setErrors({})
    setRequestError('')
    setSuccessMessage('')
    document.getElementById('planName')?.focus()
  }

  async function handleDeletePlan(id) {
    if (isBusy) return
    setRequestError('')
    setSuccessMessage('')
    setDeletingId(id)
    try {
      await onDeletePlan(id)
      if (editingId === id) resetForm()
      setSuccessMessage('Rencana kunjungan berhasil dihapus.')
    } catch (error) {
      setRequestError(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="visit-plan-form-section">
      <div className="page-container">
        <div className="visit-plan-form-heading">
          <SectionHeading
            eyebrow="PERJALANAN PILIHANMU"
            title="Rencanakan kunjungan"
            description="Buat rencana perjalanan dengan memilih destinasi wisata dan tanggal kunjungan."
          />
        </div>

        <form className="visit-plan-form" onSubmit={handleSubmit} noValidate>
          {editingId && <p className="visit-plan-edit-notice">Sedang mengedit rencana kunjungan.</p>}
          {Object.keys(errors).length > 0 && (
            <div className="form-error-summary" role="alert">Lengkapi atau perbaiki isian yang ditandai.</div>
          )}
          <div className="visit-plan-fields">
            <div className="form-field">
              <label htmlFor="planName">Nama rencana kunjungan</label>
              <input
                className="form-control" id="planName" name="planName" type="text"
                value={planName} onChange={handleFieldChange('planName', setPlanName)}
                aria-invalid={Boolean(errors.planName)}
                aria-describedby={errors.planName ? 'planName-error' : undefined}
                required minLength={3}
              />
              {errors.planName && <p className="field-error" id="planName-error">{errors.planName}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="planDestination">Destinasi wisata</label>
              <select
                className="form-control" id="planDestination" name="destinationId"
                value={destinationId} onChange={handleFieldChange('destinationId', setDestinationId)}
                aria-invalid={Boolean(errors.destinationId)}
                aria-describedby={errors.destinationId ? 'planDestination-error' : undefined}
                required
              >
                <option value="">Pilih destinasi</option>
                {items.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
              </select>
              {errors.destinationId && <p className="field-error" id="planDestination-error">{errors.destinationId}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="planVisitDate">Tanggal kunjungan</label>
              <input
                className="form-control" id="planVisitDate" name="visitDate" type="date"
                min={today} value={visitDate}
                onChange={handleFieldChange('visitDate', setVisitDate)}
                aria-invalid={Boolean(errors.visitDate)}
                aria-describedby={errors.visitDate ? 'planVisitDate-error' : undefined}
                required
              />
              {errors.visitDate && <p className="field-error" id="planVisitDate-error">{errors.visitDate}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="planParticipantCount">Jumlah peserta</label>
              <input
                className="form-control" id="planParticipantCount" name="participantCount"
                type="number" min="1" step="1" value={participantCount}
                onChange={handleFieldChange('participantCount', setParticipantCount)}
                aria-invalid={Boolean(errors.participantCount)}
                aria-describedby={errors.participantCount ? 'participantCount-error' : undefined}
                required
              />
              {errors.participantCount && <p className="field-error" id="participantCount-error">{errors.participantCount}</p>}
            </div>

            <label className="visit-plan-checkbox form-field-full">
              <input
                type="checkbox" checked={isCompleted}
                onChange={(event) => setIsCompleted(event.target.checked)}
              />
              <span>Kunjungan sudah selesai</span>
            </label>
          </div>

          <div className="visit-plan-form-actions">
            <button className="button button-primary" type="submit" disabled={isBusy}>
              {isSubmitting ? 'Menyimpan…' : editingId ? 'Simpan Perubahan' : 'Tambah Rencana'} <span aria-hidden="true">→</span>
            </button>
            {editingId && (
              <button className="button button-secondary" type="button" onClick={resetForm} disabled={isBusy}>
                Batal Edit
              </button>
            )}
          </div>
        </form>

        {loadError && <p className="visit-plan-alert" role="alert">{loadError}</p>}
        {requestError && <p className="visit-plan-alert" role="alert">{requestError}</p>}
        {successMessage && <p className="visit-plan-success" role="status">{successMessage}</p>}

        <section className="visit-plan-list" aria-labelledby="visit-plan-list-title" aria-live="polite">
          <div className="visit-plan-list-heading">
            <SectionHeading
              eyebrow="RENCANA PERJALANAN" title="Daftar Rencana Kunjungan"
              headingId="visit-plan-list-title"
            />
          </div>
          {isLoading ? (
            <p className="visit-plan-empty">Memuat rencana kunjungan dari backend…</p>
          ) : plans.length === 0 ? (
            <p className="visit-plan-empty">Belum ada data rencana kunjungan</p>
          ) : (
            <div className="visit-plan-cards">
              {plans.map((plan) => (
                <VisitPlanCard
                  key={plan.id} plan={plan} onEdit={handleEditPlan}
                  onDelete={handleDeletePlan} isBusy={isBusy}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default VisitPlanList
