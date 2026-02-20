const test = require('node:test');
const assert = require('node:assert/strict');

const RideStatus = {
  REQUESTED: 'REQUESTED',
  NEGOTIATING: 'NEGOTIATING',
  ASSIGNED: 'ASSIGNED',
  DRIVER_EN_ROUTE: 'DRIVER_EN_ROUTE',
  ARRIVED: 'ARRIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
};

const canTransitionRideStatus = (from, to) => {
  if (from === to) return true;
  const forward = {
    REQUESTED: ['NEGOTIATING', 'ASSIGNED', 'EXPIRED'],
    NEGOTIATING: ['ASSIGNED', 'EXPIRED'],
    ASSIGNED: ['DRIVER_EN_ROUTE'],
    DRIVER_EN_ROUTE: ['ARRIVED'],
    ARRIVED: ['IN_PROGRESS'],
    IN_PROGRESS: ['COMPLETED']
  };

  const cancellable = new Set([
    'REQUESTED',
    'NEGOTIATING',
    'ASSIGNED',
    'DRIVER_EN_ROUTE',
    'ARRIVED',
    'IN_PROGRESS'
  ]);

  if (to === RideStatus.CANCELLED) {
    return cancellable.has(from);
  }

  return forward[from]?.includes(to) ?? false;
};

test('allows forward lifecycle transitions', () => {
  assert.equal(canTransitionRideStatus(RideStatus.ASSIGNED, RideStatus.DRIVER_EN_ROUTE), true);
  assert.equal(canTransitionRideStatus(RideStatus.ARRIVED, RideStatus.IN_PROGRESS), true);
  assert.equal(canTransitionRideStatus(RideStatus.IN_PROGRESS, RideStatus.COMPLETED), true);
});

test('allows cancellation before completion', () => {
  assert.equal(canTransitionRideStatus(RideStatus.REQUESTED, RideStatus.CANCELLED), true);
  assert.equal(canTransitionRideStatus(RideStatus.DRIVER_EN_ROUTE, RideStatus.CANCELLED), true);
});

test('rejects invalid transitions', () => {
  assert.equal(canTransitionRideStatus(RideStatus.REQUESTED, RideStatus.COMPLETED), false);
  assert.equal(canTransitionRideStatus(RideStatus.COMPLETED, RideStatus.CANCELLED), false);
  assert.equal(canTransitionRideStatus(RideStatus.EXPIRED, RideStatus.ASSIGNED), false);
});
