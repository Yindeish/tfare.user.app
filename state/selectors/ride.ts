import { useAppSelector } from "../hooks/useReduxToolkit";
import { RootState } from "../store";


function RideSelectors() {
    const { dropoffBusstopInput, loading, pickupBusstopInput, userCounterFare, currentRideView, addTicketStatus, availableRides, userRide, userSelectedSeats, searchMatchBusstops, ticketAsTicket1, currentSeat, driverRatingInput, driverRatingCommentInput, cancelRideReason, activeTab } = useAppSelector((state: RootState) => state.ride);

    return { dropoffBusstopInput, pickupBusstopInput, loading, userCounterFare, currentRideView, addTicketStatus, availableRides, userRide, userSelectedSeats, searchMatchBusstops, ticketAsTicket1, currentSeat, driverRatingInput, driverRatingCommentInput, cancelRideReason, activeTab };
}

export default RideSelectors;