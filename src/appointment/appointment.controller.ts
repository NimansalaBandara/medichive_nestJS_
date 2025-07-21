import {Controller,Get, Param,ParseIntPipe, Patch,Post, Body,UseGuards,Req,} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import {
  CheckAvailabilityDto,
  CheckConfirmAppointmentDto,
} from './dto/create-object.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserExistsMiddleware } from 'src/middleware/user-valid.middleware';

@Controller('appointments')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @UseGuards(UserExistsMiddleware)
  @UseGuards(AuthGuard('jwt'))
  @Post('check-availability')
  filterAvailability(
    @Req() request: any,
    @Body() filter: CheckAvailabilityDto,
  ) {
    const userId = request.user.userId;
    return this.appointmentService.getFilteredAvailability(filter, userId);
  }

  @UseGuards(UserExistsMiddleware)
  @UseGuards(AuthGuard('jwt'))
  @Post('confirm-appointment')
  confirmAppointment(
    @Req() request: any,
    @Body() filter: CheckConfirmAppointmentDto,
  ) {
    const userId = request.user.userId;
    return this.appointmentService.postConfirmAppointment(filter, userId);
  }

  @UseGuards(UserExistsMiddleware)
  @UseGuards(AuthGuard('jwt'))
  @Get('get-appointments-userid')
  getAppointmentByUserID(@Req() request: any) {
    const userId = request.user.userId;
    return this.appointmentService.getAppointmentByUserID(userId);
  }

  @UseGuards(UserExistsMiddleware)
  @UseGuards(AuthGuard('jwt'))
  @Post('make-payment')
  makePayment(@Body() body: { appId: number }) {
    const { appId } = body;
    return this.appointmentService.makePayment(appId);
  }

  @UseGuards(UserExistsMiddleware)
  @UseGuards(AuthGuard('jwt'))
  @Post('get-appointments-id')
  getAppointmentByID(@Body() body: { appId: number }) {
    const { appId } = body;
    return this.appointmentService.getAppointmentByID(appId);
  }

  @UseGuards(UserExistsMiddleware)
  @UseGuards(AuthGuard('jwt'))
  @Post('cancel-appointment')
  cancelAppointment(@Body() body: { appId: number }) {
    const { appId } = body;
    return this.appointmentService.cancelAppointment(appId);
  }
}
