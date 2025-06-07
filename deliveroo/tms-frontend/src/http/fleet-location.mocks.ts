import { randomCoordinateCentralEurope } from "./fleet-coordinates.mocks";
import { mockTrucks } from "./vehicles.mocks";
import { Truck } from "./vehicles.model";

export type FleetLocation = {
  truckId: Truck['id'];
  coordinates: {
    latitude: number;
    longitude: number;
  }
  truck: Truck;
}

export const mockFleetLocation: FleetLocation[] = mockTrucks.map(truck => {
  const coords = randomCoordinateCentralEurope();
  return {
    truckId: truck.id,
    coordinates: {
      latitude: coords.latitude,
      longitude: coords.longitude,
    },
    truck: truck,
  }
});
