import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isAfter, format, parse } from 'date-fns';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  private datetimefixer(date: string, time: string) {
    const tt = parse(time, 'h a', new Date());
    const time24h = format(tt, 'HH:mm');
    return new Date(`${date}T${time24h}:00`);
  }

  private async isBooked(
    doctorId: number,
    instituteId: number,
    userId: number,
    date: string,
    startTime: string,
    endTime: string,
  ) {
    const apps = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        instituteId: instituteId,
        patientId: userId,
        date: date,
        startTime: startTime,
        endTime: endTime,
        status: {
          in: [0, 1, 2],
        },
      },
    });

    if (apps.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  async getFilteredAvailability(
    filter: {
      doctorId?: number;
      instituteId?: number;
      date?: string;
    },
    userId: number,
  ) {
    const { doctorId, instituteId, date } = filter;

    const whereClause: any = {
      AND: [],
    };

    if (doctorId) {
      whereClause.AND.push({ doctorId });
    }

    if (instituteId) {
      whereClause.AND.push({ instituteId });
    }

    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    const results = await this.prisma.instituteDoctor.findMany({
      where: whereClause,
      include: {
        slots: {
          where: date ? { date } : undefined,
          select: {
            // id: true,
            date: true,
            startTime: true,
            endTime: true,
          },
        },
        doctor: {
          select: {
            // userId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        institute: {
          select: {
            // id: true,
            name: true,
          },
        },
      },
    });

    const now = new Date();
    const resultsWithActive1 = results.map((obj) => ({
      ...obj,
      slots: obj.slots
        .map((slot) => {
          const fullDateTime = this.datetimefixer(slot.date, slot.startTime);
          return {
            ...slot,
            active: isAfter(fullDateTime, now), // ✅ Add the dynamic field
          };
        })
        .filter((slot) => slot.active),
    }));

    const resultsWithActive2 = await Promise.all(
      resultsWithActive1.map(async ({ slots, ...obj }) => {
        const resolvedSlots = await Promise.all(
          slots.map(async ({ active, ...slot }) => {
            const isActive = await this.isBooked(
              obj.doctorId,
              obj.instituteId,
              userId,
              slot.date,
              slot.startTime,
              slot.endTime,
            );
            return {
              ...slot,
              active: isActive,
            };
          }),
        );

        const filteredSlots = resolvedSlots.filter((slot) => slot.active);

        return {
          ...obj,
          slots: filteredSlots,
        };
      }),
    );

    const formattedDoctorData = resultsWithActive2.map(
      ({ institute, doctor, ...rest }) => ({
        ...rest,
        instituteName: institute.name,
        doctorName: doctor.user.name,
      }),
    );

    return formattedDoctorData;
  }

  async postConfirmAppointment(
    filter: {
      doctorId: number;
      instituteId: number;
      date: string;
      startTime: string;
      endTime: string;
      symptoms: string;
      notes: string;
    },
    userId: number,
  ) {
    const { doctorId, instituteId, date, startTime, endTime, symptoms, notes } =
      filter;
    console.log(filter);
    console.log(userId);
    return await this.prisma.appointment.create({
      data: {
        patientId: userId,
        doctorId: doctorId,
        instituteId: instituteId,
        date: date,
        startTime: startTime,
        endTime: endTime,
        symptoms: symptoms,
        notes: notes,
        status: 0,
      },
    });
  }

  async getAppointmentByUserID(userId: number) {
    const result = await this.prisma.appointment.findMany({
      where: {
        patientId: userId,
      },
      include: {
        doctor: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        patient: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        institute: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedAppointmentData = result.map(
      ({ doctor, institute, patient, amount, ...obj }) => ({
        ...obj,
        doctorName: doctor.user.name,
        patientName: patient.user.name,
        instituteName: institute.name,
        amount: parseFloat(amount.toFixed(1)),
      }),
    );

    return formattedAppointmentData;
  }

  private generateRefNo(userId: any, doctorId: any, instituteId: any): string {
    const timestamp = Date.now(); // milliseconds since epoch
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `REF-${userId}${doctorId}${instituteId}-${timestamp}-${random}`;
  }

  async makePayment(appId: number) {
    const temp = await this.prisma.appointment.findUnique({
      where: {
        id: appId,
      },
    });

    const refNo = this.generateRefNo(
      temp?.patientId,
      temp?.doctorId,
      temp?.instituteId,
    );

    const result = await this.prisma.appointment.update({
      where: {
        id: appId,
      },
      data: {
        status: 2,
        refNo: refNo,
      },
    });
  }

  async cancelAppointment(appId: number) {
    const result = await this.prisma.appointment.update({
      where: {
        id: appId,
      },
      data: {
        status: 4,
      },
    });
  }

  async getAppointmentByID(appId: number) {
    const result = await this.prisma.appointment.findMany({
      where: {
        id: appId,
      },
      include: {
        doctor: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        institute: {
          select: {
            name: true,
          },
        },
        patient: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedAppointmentData = result.map(
      ({ doctor, institute, patient, amount, ...obj }) => ({
        ...obj,
        doctorName: doctor.user.name,
        instituteName: institute.name,
        patientName: patient.user.name,
        amount: parseFloat(amount.toFixed(1)),
      }),
    );

    return formattedAppointmentData;
  }
}
