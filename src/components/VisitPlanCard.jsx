function VisitPlanCard({ plan, onEdit, onDelete, isBusy }) {
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${plan.visitDate}T00:00:00`))

  return (
    <article className="visit-plan-card">
      <div className="visit-plan-card-content">
        <h3>{plan.name}</h3>
        <p><span>Destinasi</span>{plan.destinationName}</p>
        <p><span>Tanggal kunjungan</span>{formattedDate}</p>
        <p><span>Jumlah peserta</span>{plan.participantCount} orang</p>
        <p><span>Status</span>{plan.isCompleted ? 'Selesai' : 'Belum selesai'}</p>
      </div>
      <div className="visit-plan-card-actions">
        <button
          className="button button-secondary visit-plan-delete"
          type="button"
          onClick={() => onEdit(plan)}
          disabled={isBusy}
          aria-label={`Edit rencana ${plan.name}`}
        >
          Edit
        </button>
        <button
          className="button button-secondary visit-plan-delete"
          type="button"
          onClick={() => onDelete(plan.id)}
          disabled={isBusy}
          aria-label={`Hapus rencana ${plan.name}`}
        >
          Hapus
        </button>
      </div>
    </article>
  )
}

export default VisitPlanCard
