export enum RideStatus {
  REQUESTED = 'REQUESTED',
  NEGOTIATING = 'NEGOTIATING',
  ASSIGNED = 'ASSIGNED',
  DRIVER_EN_ROUTE = 'DRIVER_EN_ROUTE',
  ARRIVED = 'ARRIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

const forwardTransitions: Partial<Record<RideStatus, RideStatus[]>> = {
  [RideStatus.REQUESTED]: [RideStatus.NEGOTIATING, RideStatus.ASSIGNED, RideStatus.EXPIRED],
  [RideStatus.NEGOTIATING]: [RideStatus.ASSIGNED, RideStatus.EXPIRED],
  [RideStatus.ASSIGNED]: [RideStatus.DRIVER_EN_ROUTE],
  [RideStatus.DRIVER_EN_ROUTE]: [RideStatus.ARRIVED],
  [RideStatus.ARRIVED]: [RideStatus.IN_PROGRESS],
  [RideStatus.IN_PROGRESS]: [RideStatus.COMPLETED]
};

const cancellableStates = new Set<RideStatus>([
  RideStatus.REQUESTED,
  RideStatus.NEGOTIATING,
  RideStatus.ASSIGNED,
  RideStatus.DRIVER_EN_ROUTE,
  RideStatus.ARRIVED,
  RideStatus.IN_PROGRESS
]);

export const canTransitionRideStatus = (from: RideStatus, to: RideStatus): boolean => {
  if (from === to) {
    return true;
  }

  if (to === RideStatus.CANCELLED) {
    return cancellableStates.has(from);
  }

  return forwardTransitions[from]?.includes(to) ?? false;
};
