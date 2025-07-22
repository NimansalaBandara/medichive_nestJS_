import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { doctorSelection } from './objects/doctorobject';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  private calculateRate(doctorData) {
    return doctorData.map((doctor) => {
      const totalRates = doctor.rates_pat.length;
      let averageRate = 0;

      if (totalRates > 0) {
        averageRate =
          doctor.rates_pat.reduce((sum, rate) => sum + rate.rate, 0) /
          totalRates;
      }

      return {
        ...doctor,
        totalRates,
        averageRate,
      };
    });
  }

  async getDoctors() {
    const doctorData = await this.prisma.doctor.findMany({
      select: {
        userId: true,
        licenseNumber: true,
        experience: true,
        rates_pat: true,
        specialization: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedDoctorData = doctorData.map(({ user, ...doctor }) => ({
      ...doctor,
      name: user.name,
    }));

    return this.calculateRate(formattedDoctorData).map(
      ({ rates_pat, ...rest }) => rest,
    );
  }

  async getDoctorsByID(id: number) {
    const doctorData = await this.prisma.doctor.findUnique({
      where: { userId: id },
      include: doctorSelection,
    });

    if (doctorData) {
      const results = this.calculateRate([doctorData]);

      const formattedDoctorData = results.map(
        ({ user, rates_pat, institutes, ...rest }) => ({
          ...rest,
          name: user.name,
          rates_pat:
            Array.isArray(rates_pat) && rates_pat.length > 0
              ? rates_pat.map((rate) => ({
                  rate: rate.rate,
                  name: rate.patient?.user?.name || null,
                }))
              : [],
          institutes:
            Array.isArray(institutes) && institutes.length > 0
              ? institutes.map((inst) => ({
                  id: inst.institute?.id || null,
                  name: inst.institute?.name || null,
                }))
              : [],
        }),
      );

      return formattedDoctorData;
    } else throw new NotFoundException(`Doctor with id ${id} not found`);
  }

  async getDoctorRate(userid: number, doctorid: number) {
    const rateData = await this.prisma.doctorPatientRate.findFirst({
      where: {
        raterId: userid,
        doctorId: doctorid,
      },
    });

    if (rateData) {
      return rateData;
    } else {
      return { rate: 0 };
    }
  }

  async updateDoctorRate(userid: number, doctorid: number, rate: number) {
    const rateData = await this.prisma.doctorPatientRate.findFirst({
      where: {
        raterId: userid,
        doctorId: doctorid,
      },
    });

    if (rateData) {
      return await this.prisma.doctorPatientRate.update({
        where: {
          raterId_doctorId: {
            raterId: userid,
            doctorId: doctorid,
          },
        },
        data: {
          rate: rate,
        },
      });
    } else {
      return await this.prisma.doctorPatientRate.create({
        data: {
          raterId: userid,
          rate: rate,
          doctorId: doctorid,
        },
      });
    }
  }
}
