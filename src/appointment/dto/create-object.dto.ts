import { IsOptional, IsString, IsNumber, Validate } from 'class-validator';
import {
  IsNonNegativeIntegerConstraint,
  IsValidDateConstraint,
} from './custom-validators';

export class CheckAvailabilityDto {
  @IsOptional()
  @Validate(IsNonNegativeIntegerConstraint, {
    message: 'Doctor ID must be a non-negative integer.',
  })
  doctorId?: number;

  @IsOptional()
  @Validate(IsNonNegativeIntegerConstraint, {
    message: 'Institute ID must be a non-negative integer.',
  })
  instituteId?: number;

  @IsOptional()
  @Validate(IsValidDateConstraint, {
    message:
      'Date must be in the format "YYYY-MM-DD" and not older than today.',
  })
  date?: string;
}

export class CheckConfirmAppointmentDto {
  @Validate(IsNonNegativeIntegerConstraint, {
    message: 'Doctor ID must be a non-negative integer.',
  })
  doctorId: number;

  @Validate(IsNonNegativeIntegerConstraint, {
    message: 'Institute ID must be a non-negative integer.',
  })
  instituteId: number;

  @Validate(IsValidDateConstraint, {
    message:
      'Date must be in the format "YYYY-MM-DD" and not older than today.',
  })
  date: string;

  @Validate(IsString, { message: 'Start time must be in...' })
  startTime: string;

  @Validate(IsString, { message: 'End time must be in...' })
  endTime: string;

  @IsOptional()
  symptoms: string;

  @IsOptional()
  notes: string;
}
