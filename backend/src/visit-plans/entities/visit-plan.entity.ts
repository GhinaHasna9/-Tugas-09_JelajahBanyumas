/** Struktur data rencana kunjungan yang dikelola oleh backend. */
export class VisitPlan {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  visitDate: string;
  participantCount: number;
  isCompleted: boolean;
  createdAt: string;
}
