-- Enums
DO $$ BEGIN
  CREATE TYPE "DriverVerificationStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'BANNED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "VehicleType" AS ENUM ('AUTO', 'MOTO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "RideType" AS ENUM ('DIRECT', 'SHARED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "OfferStatus" AS ENUM ('SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TYPE "RideStatus" ADD VALUE IF NOT EXISTS 'DRAFT';
ALTER TYPE "RideStatus" ADD VALUE IF NOT EXISTS 'SEARCHING';
ALTER TYPE "RideStatus" ADD VALUE IF NOT EXISTS 'IN_PROGRESS';

-- User extensions
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "firstName" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastName" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

UPDATE "User" SET "firstName" = COALESCE("firstName", 'User');
UPDATE "User" SET "lastName" = COALESCE("lastName", 'Zippy');

ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "lastName" SET NOT NULL;

-- Favorite places
CREATE TABLE IF NOT EXISTS "FavoritePlace" (
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

CREATE INDEX IF NOT EXISTS "FavoritePlace_userId_idx" ON "FavoritePlace"("userId");
ALTER TABLE "FavoritePlace" ADD CONSTRAINT "FavoritePlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Driver profile
CREATE TABLE IF NOT EXISTS "DriverProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" "DriverVerificationStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
  "vehicleType" "VehicleType" NOT NULL,
  "plateNumber" TEXT NOT NULL,
  "isOnline" BOOLEAN NOT NULL DEFAULT false,
  "lastLocationLat" DOUBLE PRECISION,
  "lastLocationLng" DOUBLE PRECISION,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DriverProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DriverProfile_userId_key" ON "DriverProfile"("userId");
CREATE INDEX IF NOT EXISTS "DriverProfile_status_idx" ON "DriverProfile"("status");
CREATE INDEX IF NOT EXISTS "DriverProfile_isOnline_idx" ON "DriverProfile"("isOnline");
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Ride extensions
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "originAddress" TEXT;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "originPlaceId" TEXT;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "originLat" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "originLng" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "destinationAddress" TEXT;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "destinationPlaceId" TEXT;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "destinationLat" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "destinationLng" DOUBLE PRECISION;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "vehicleType" "VehicleType";
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "rideType" "RideType";
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "distanceMeters" INTEGER;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "durationSeconds" INTEGER;
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "estimatedMin" DECIMAL(10,2);
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "estimatedMax" DECIMAL(10,2);
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "finalPrice" DECIMAL(10,2);

UPDATE "Ride" SET
  "originAddress" = COALESCE("originAddress", 'Origen no informado'),
  "originLat" = COALESCE("originLat", 0),
  "originLng" = COALESCE("originLng", 0),
  "destinationAddress" = COALESCE("destinationAddress", 'Destino no informado'),
  "destinationLat" = COALESCE("destinationLat", 0),
  "destinationLng" = COALESCE("destinationLng", 0),
  "vehicleType" = COALESCE("vehicleType", 'AUTO'::"VehicleType"),
  "rideType" = COALESCE("rideType", 'DIRECT'::"RideType");

ALTER TABLE "Ride" ALTER COLUMN "passengerId" SET NOT NULL;
ALTER TABLE "Ride" ALTER COLUMN "originAddress" SET NOT NULL;
ALTER TABLE "Ride" ALTER COLUMN "originLat" SET NOT NULL;
ALTER TABLE "Ride" ALTER COLUMN "originLng" SET NOT NULL;
ALTER TABLE "Ride" ALTER COLUMN "destinationAddress" SET NOT NULL;
ALTER TABLE "Ride" ALTER COLUMN "destinationLat" SET NOT NULL;
ALTER TABLE "Ride" ALTER COLUMN "destinationLng" SET NOT NULL;
ALTER TABLE "Ride" ALTER COLUMN "vehicleType" SET NOT NULL;
ALTER TABLE "Ride" ALTER COLUMN "rideType" SET NOT NULL;
ALTER TABLE "Ride" ALTER COLUMN "status" SET DEFAULT 'SEARCHING';

-- Offers status migration
ALTER TABLE "Offer" ADD COLUMN IF NOT EXISTS "status" "OfferStatus";
UPDATE "Offer" SET "status" = CASE WHEN "isAccepted" = true THEN 'ACCEPTED'::"OfferStatus" ELSE 'SENT'::"OfferStatus" END WHERE "status" IS NULL;
ALTER TABLE "Offer" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "Offer" ALTER COLUMN "status" SET DEFAULT 'SENT';
ALTER TABLE "Offer" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- RideStatusHistory
CREATE TABLE IF NOT EXISTS "RideStatusHistory" (
  "id" TEXT NOT NULL,
  "rideId" TEXT NOT NULL,
  "status" "RideStatus" NOT NULL,
  "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RideStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "RideStatusHistory_rideId_idx" ON "RideStatusHistory"("rideId");
CREATE INDEX IF NOT EXISTS "RideStatusHistory_at_idx" ON "RideStatusHistory"("at");
ALTER TABLE "RideStatusHistory" ADD CONSTRAINT "RideStatusHistory_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AppConfig singleton
CREATE TABLE IF NOT EXISTS "AppConfig" (
  "id" INTEGER NOT NULL DEFAULT 1,
  "googleMapsWebKey" TEXT,
  "googleMapsServerKey" TEXT,
  "enablePlaces" BOOLEAN NOT NULL DEFAULT true,
  "enableDistanceMatrix" BOOLEAN NOT NULL DEFAULT true,
  "enableDirections" BOOLEAN NOT NULL DEFAULT true,
  "pricing" JSONB,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);
