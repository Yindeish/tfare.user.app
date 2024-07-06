import { useAppSelector } from "../hooks/useReduxToolkit";
import { RootState } from "../store";


function RideSelectors() {
    const { dropoffBusstopInput, loading, pickupBusstopInput, userCounterFare, currentRideView, addAnotherTicket, availableRides, userRide, userSelectedSeats, searchMatchBusstops, ticketAsTicket1 } = useAppSelector((state: RootState) => state.ride);

    return { dropoffBusstopInput, pickupBusstopInput, loading, userCounterFare, currentRideView, addAnotherTicket, availableRides, userRide, userSelectedSeats, searchMatchBusstops, ticketAsTicket1 };
}

export default RideSelectors;