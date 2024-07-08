import { useAppSelector } from "../hooks/useReduxToolkit"
import { RootState } from "../store"


const AccountSelectors = () => {

    const { emergencyContacts, loading, profileCta, savedAddresses, stateInput, userAccount } = useAppSelector((state: RootState) => state.account);

    return { emergencyContacts, loading, profileCta, savedAddresses, stateInput, userAccount }
}

export default AccountSelectors;