import { useAppSelector } from "../hooks/useReduxToolkit";
import { RootState } from "../store";


function RideSelectors() {
    const { loading, currentRideView, addTicketStatus, availableRides, userRide, searchMatchBusstops, ticketAsTicket1, currentNumberOfTickets, activeTab, stateInput, currentTicket, counterFareStatus } = useAppSelector((state: RootState) => state.ride);

    return { loading, currentRideView, addTicketStatus, availableRides, userRide, searchMatchBusstops, ticketAsTicket1, currentNumberOfTickets, activeTab, stateInput, currentTicket, counterFareStatus };
}

export default RideSelectors;