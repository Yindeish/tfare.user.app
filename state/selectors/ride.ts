import { useAppSelector } from "../hooks/useReduxToolkit";
import { RootState } from "../store";


function RideSelectors() {
    const { loading, currentRideView, availableRides, userRide, searchMatchBusstops, currentNumberOfTickets, activeTab, stateInput, currentTicket, counterFareStatus, allTicketsFilled, duration, paymentOptionsVisible, price, seats } = useAppSelector((state: RootState) => state.ride);

    return { loading, currentRideView, availableRides, userRide, searchMatchBusstops, currentNumberOfTickets, activeTab, stateInput, currentTicket, counterFareStatus, allTicketsFilled, duration, paymentOptionsVisible, price, seats };
}

export default RideSelectors;