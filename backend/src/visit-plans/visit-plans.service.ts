import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateVisitPlanDto } from './dto/create-visit-plan.dto';
import { UpdateVisitPlanDto } from './dto/update-visit-plan.dto';
import { VisitPlan } from './entities/visit-plan.entity';

@Injectable()
export class VisitPlansService {
  // Sesuai tugas: hanya array dalam memori (terhapus bila server restart).
  private readonly plans: VisitPlan[] = [];

  private ensureNoDuplicate(
    input: Pick<VisitPlan, 'name' | 'destinationId' | 'visitDate'>,
    exceptId?: string,
  ): void {
    const duplicate = this.plans.some(
      (plan) =>
        plan.id !== exceptId &&
        plan.name.trim().toLowerCase() === input.name.trim().toLowerCase() &&
        plan.destinationId === input.destinationId &&
        plan.visitDate === input.visitDate,
    );
    if (duplicate) {
      throw new ConflictException(
        'Rencana dengan nama, destinasi, dan tanggal yang sama sudah ada.',
      );
    }
  }

  create(dto: CreateVisitPlanDto): VisitPlan {
    this.ensureNoDuplicate(dto);
    const plan: VisitPlan = {
      ...dto,
      name: dto.name.trim(),
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.plans.push(plan);
    return plan;
  }

  findAll(): VisitPlan[] {
    return [...this.plans];
  }

  findOne(id: string): VisitPlan {
    const plan = this.plans.find((entry) => entry.id === id);
    if (!plan) {
      throw new NotFoundException(`Rencana kunjungan dengan ID ${id} tidak ditemukan.`);
    }
    return plan;
  }

  update(id: string, dto: UpdateVisitPlanDto): VisitPlan {
    const existing = this.findOne(id);
    const updated: VisitPlan = {
      ...existing,
      ...dto,
      name: dto.name !== undefined ? dto.name.trim() : existing.name,
    };
    this.ensureNoDuplicate(updated, id);
    Object.assign(existing, updated);
    return existing;
  }

  remove(id: string): { message: string } {
    this.findOne(id);
    const index = this.plans.findIndex((plan) => plan.id === id);
    this.plans.splice(index, 1);
    return { message: 'Rencana kunjungan berhasil dihapus.' };
  }
}
