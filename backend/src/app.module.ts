import { Module } from '@nestjs/common';
import { VisitPlansModule } from './visit-plans/visit-plans.module';

@Module({
  imports: [VisitPlansModule],
})
export class AppModule {}
