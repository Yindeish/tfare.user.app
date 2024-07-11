import { useAppSelector } from "../hooks/useReduxToolkit";
import { RootState } from "../store";


function LayoutSelectors() {

    const { bottomSheet, modal } = useAppSelector((state: RootState) => state.layout);

    return { bottomSheet, modal }
}

export default LayoutSelectors;