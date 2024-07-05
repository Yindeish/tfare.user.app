import { useAppSelector } from "../hooks/useReduxToolkit";
import { RootState } from "../store";


function RideSelectors() {
    const { dropoffBusstopInput, loading, pickupBusstopInput, userProposedAmount, currentRideView, addAnotherTicket, availableRides, userRides, userSelectedSeats, searchMatchBusstops, ticketAsTicket1 } = useAppSelector((state: RootState) => state.ride);

    return { dropoffBusstopInput, pickupBusstopInput, loading, userProposedAmount, currentRideView, addAnotherTicket, availableRides, userRides, userSelectedSeats, searchMatchBusstops, ticketAsTicket1 };
}

export default RideSelectors;