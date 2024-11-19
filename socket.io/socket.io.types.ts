import { IRiderRideDetails } from "@/state/types/ride";

export interface IRideAccptedEvent {
    driverId: string,
    driverName: string,
    ride: IRiderRideDetails
} 