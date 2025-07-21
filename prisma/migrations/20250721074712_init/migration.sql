-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEDICHIVE_ADMIN', 'INSTITUTE_ADMIN', 'LAB_ADMIN', 'DOCTOR', 'PATIENT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "nic" TEXT,
    "contactNo" TEXT,
    "gender" "Gender" NOT NULL,
    "dob" TIMESTAMP(3),
    "roles" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "experience" DOUBLE PRECISION NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorSpecialization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "DoctorSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "website" TEXT,
    "address" TEXT,
    "description" TEXT,
    "certificate" TEXT,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "symptoms" TEXT,
    "notes" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" INTEGER NOT NULL,
    "refNo" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutePatientRate" (
    "raterId" INTEGER NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,

    CONSTRAINT "InstitutePatientRate_pkey" PRIMARY KEY ("raterId","instituteId")
);

-- CreateTable
CREATE TABLE "DoctorPatientRate" (
    "raterId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,

    CONSTRAINT "DoctorPatientRate_pkey" PRIMARY KEY ("raterId","doctorId")
);

-- CreateTable
CREATE TABLE "InstituteDoctor" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "instituteId" INTEGER NOT NULL,

    CONSTRAINT "InstituteDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorAvailability" (
    "id" SERIAL NOT NULL,
    "doctorInstituteId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "DoctorAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nic_key" ON "User"("nic");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_licenseNumber_key" ON "Doctor"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_userId_key" ON "Doctor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Institute_registrationNumber_key" ON "Institute"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutePatientRate_raterId_instituteId_key" ON "InstitutePatientRate"("raterId", "instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorPatientRate_raterId_doctorId_key" ON "DoctorPatientRate"("raterId", "doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "InstituteDoctor_doctorId_instituteId_key" ON "InstituteDoctor"("doctorId", "instituteId");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutePatientRate" ADD CONSTRAINT "InstitutePatientRate_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Patient"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutePatientRate" ADD CONSTRAINT "InstitutePatientRate_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorPatientRate" ADD CONSTRAINT "DoctorPatientRate_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Patient"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorPatientRate" ADD CONSTRAINT "DoctorPatientRate_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteDoctor" ADD CONSTRAINT "InstituteDoctor_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteDoctor" ADD CONSTRAINT "InstituteDoctor_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAvailability" ADD CONSTRAINT "DoctorAvailability_doctorInstituteId_fkey" FOREIGN KEY ("doctorInstituteId") REFERENCES "InstituteDoctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
