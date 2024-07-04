import { useAppSelector } from "../hooks/useReduxToolkit";
import { RootState } from "../store";


function RideSelectors() {
    const { dropoffBusstopInput, loading, pickupBusstopInput, userProposedAmount, currentRideView } = useAppSelector((state: RootState) => state.ride);

    return { dropoffBusstopInput, pickupBusstopInput, loading, userProposedAmount, currentRideView };
}

export default RideSelectors;