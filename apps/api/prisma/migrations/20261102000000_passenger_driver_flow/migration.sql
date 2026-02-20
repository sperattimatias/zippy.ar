-- Drop legacy tables
DROP TABLE IF EXISTS "RideEvent";
DROP TABLE IF EXISTS "Offer";
DROP TABLE IF EXISTS "Ride";
DROP TABLE IF EXISTS "User";

DROP TYPE IF EXISTS "RideStatus";
DROP TYPE IF EXISTS "Role";

-- Create enums
CREATE TYPE "Role" AS ENUM ('PASSENGER', 'DRIVER', 'ADMIN');
CREATE TYPE "DriverStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'BANNED');
CREATE TYPE "VehicleType" AS ENUM ('AUTO', 'MOTO');
CREATE TYPE "RideType" AS ENUM ('DIRECT', 'SHARED');
CREATE TYPE "RideStatus" AS ENUM ('DRAFT', 'SEARCHING', 'ASSIGNED', 'DRIVER_EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "OfferStatus" AS ENUM ('SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'PASSENGER',
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "refreshTokenHash" TEXT,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT,
  "avatarUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FavoritePlace" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "placeId" TEXT NOT NULL,
  "lat" DOUBLE PRECISION NOT NULL,
  "lng" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FavoritePlace_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DriverProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" "DriverStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
  "vehicleType" "VehicleType" NOT NULL,
  "plateNumber" TEXT NOT NULL,
  "isOnline" BOOLEAN NOT NULL DEFAULT false,
  "lastLocationLat" DOUBLE PRECISION,
  "lastLocationLng" DOUBLE PRECISION,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DriverProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Ride" (
  "id" TEXT NOT NULL,
  "passengerId" TEXT NOT NULL,
  "driverId" TEXT,
  "originAddress" TEXT NOT NULL,
  "originPlaceId" TEXT NOT NULL,
  "originLat" DOUBLE PRECISION NOT NULL,
  "originLng" DOUBLE PRECISION NOT NULL,
  "destinationAddress" TEXT NOT NULL,
  "destinationPlaceId" TEXT NOT NULL,
  "destinationLat" DOUBLE PRECISION NOT NULL,
  "destinationLng" DOUBLE PRECISION NOT NULL,
  "vehicleType" "VehicleType" NOT NULL,
  "rideType" "RideType" NOT NULL,
  "luggage" BOOLEAN NOT NULL DEFAULT false,
  "pet" BOOLEAN NOT NULL DEFAULT false,
  "accessibility" BOOLEAN NOT NULL DEFAULT false,
  "note" TEXT,
  "distanceMeters" INTEGER NOT NULL,
  "durationSeconds" INTEGER NOT NULL,
  "estimatedMin" DECIMAL(10,2) NOT NULL,
  "estimatedMax" DECIMAL(10,2) NOT NULL,
  "finalPrice" DECIMAL(10,2),
  "status" "RideStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RideStatusHistory" (
  "id" TEXT NOT NULL,
  "rideId" TEXT NOT NULL,
  "status" "RideStatus" NOT NULL,
  "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RideStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Offer" (
  "id" TEXT NOT NULL,
  "rideId" TEXT NOT NULL,
  "driverId" TEXT NOT NULL,
  "status" "OfferStatus" NOT NULL DEFAULT 'SENT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AppConfig" (
  "id" TEXT NOT NULL DEFAULT 'singleton',
  "googleMapsWebKey" TEXT,
  "googleMapsServerKey" TEXT,
  "enablePlaces" BOOLEAN NOT NULL DEFAULT true,
  "enableDistanceMatrix" BOOLEAN NOT NULL DEFAULT true,
  "enableDirections" BOOLEAN NOT NULL DEFAULT false,
  "pricing" JSONB NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "FavoritePlace_userId_idx" ON "FavoritePlace"("userId");
CREATE UNIQUE INDEX "DriverProfile_userId_key" ON "DriverProfile"("userId");
CREATE INDEX "Ride_passengerId_idx" ON "Ride"("passengerId");
CREATE INDEX "Ride_driverId_idx" ON "Ride"("driverId");
CREATE INDEX "Ride_status_idx" ON "Ride"("status");
CREATE INDEX "RideStatusHistory_rideId_idx" ON "RideStatusHistory"("rideId");
CREATE INDEX "Offer_rideId_idx" ON "Offer"("rideId");
CREATE INDEX "Offer_driverId_idx" ON "Offer"("driverId");

ALTER TABLE "FavoritePlace" ADD CONSTRAINT "FavoritePlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RideStatusHistory" ADD CONSTRAINT "RideStatusHistory_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
