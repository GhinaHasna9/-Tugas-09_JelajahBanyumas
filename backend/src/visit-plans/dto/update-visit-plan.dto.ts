import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitPlanDto } from './create-visit-plan.dto';

/** Field tidak wajib saat PATCH, tetapi aturan validasinya tetap berlaku. */
export class UpdateVisitPlanDto extends PartialType(CreateVisitPlanDto) {}
