import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateVisitPlanDto } from './dto/create-visit-plan.dto';
import { UpdateVisitPlanDto } from './dto/update-visit-plan.dto';
import { VisitPlansService } from './visit-plans.service';

@Controller('visit-plans')
export class VisitPlansController {
  // Dependency injection: controller tidak membuat instance service sendiri.
  constructor(private readonly visitPlansService: VisitPlansService) {}

  @Post()
  create(@Body() dto: CreateVisitPlanDto) {
    return this.visitPlansService.create(dto);
  }

  @Get()
  findAll() {
    return this.visitPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitPlansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVisitPlanDto) {
    return this.visitPlansService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitPlansService.remove(id);
  }
}
