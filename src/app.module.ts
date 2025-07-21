import { Module } from '@nestjs/common';
import { InstituteModule } from './institute/institute.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [InstituteModule, DoctorModule, AppointmentModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
