import { Controller } from '@nestjs/common';

@Controller('doctor')
export class DoctorController {}
import { UserExistsMiddleware } from 'src/middleware/user-valid.middleware';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('doctors')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get()
  getDoctors() {
    //console.log("Hi");
    return this.doctorService.getDoctors();
  }

  @Get(':id')
  getDoctorsByID(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.getDoctorsByID(id);
  }

  @Post('userrate')
  @UseGuards(UserExistsMiddleware)
  @UseGuards(AuthGuard('jwt'))
  getDoctorRate(@Req() request: any, @Body() body: { doctorId: number }) {
    const userid = request.user.userId;
    const { doctorId } = body;
    return this.doctorService.getDoctorRate(userid, doctorId);
  }

  @Patch('updaterate')
  @UseGuards(UserExistsMiddleware)
  @UseGuards(AuthGuard('jwt'))
  updateDoctorRate(
    @Req() request: any,
    @Body() body: { doctorId: number; rate: number },
  ) {
    const userid = request.user.userId;
    const { doctorId, rate } = body;
    console.log(userid);
    console.log(doctorId);
    console.log(rate);
    return this.doctorService.updateDoctorRate(userid, doctorId, rate);
  }
}
