import { useAppSelector } from "../hooks/useReduxToolkit";
import { RootState } from "../store";


function RideSelectors() {
    const { loading, currentRideView, availableRides, userRide, searchMatchBusstops, currentNumberOfTickets, activeTab, stateInput, currentTicket, counterFareStatus, allTicketsFilled } = useAppSelector((state: RootState) => state.ride);

    return { loading, currentRideView, availableRides, userRide, searchMatchBusstops, currentNumberOfTickets, activeTab, stateInput, currentTicket, counterFareStatus, allTicketsFilled };
}

export default RideSelectors;