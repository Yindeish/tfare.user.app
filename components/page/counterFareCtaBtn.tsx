import Colors, { colors } from "@/constants/Colors";
import { RideConstants } from "@/constants/ride";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import RideSelectors from "@/state/selectors/ride";
import { setCounterFareStatus, setState, setStateInputField } from "@/state/slices/ride";
import { RootState } from "@/state/store";
import { ITicketInput, TRideStatus } from "@/state/types/ride";
import { supabase } from "@/supabase/supabase.config";
import { c, colorWhite, fs16, fw700, neurialGrotesk } from "@/utils/fontStyles";
import {
  bg,
  flex,
  gap,
  h,
  itemsCenter,
  justifyCenter,
  justifyStart,
  pl,
  rounded,
  w,
} from "@/utils/styles";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

function CounterFareCtaBtn({fetchState, negotiateTicketFare, setFetchState, ticket}: {
  negotiateTicketFare: () => Promise<void>;
  fetchState: {
    loading: boolean;
    msg: string;
    code: null;
  };
  setFetchState: React.Dispatch<
    React.SetStateAction<{
      loading: boolean;
      msg: string;
      code: null;
    }>
  >;
  ticket: ITicketInput
}) {
  const dispatch = useAppDispatch();
  const {counterFareStatus, riderRideDetails, stateInput:{ticketsDetails}} = useAppSelector((state: RootState) => state.ride);
  console.log({riderRideDetails, counterFareStatus})

  const channel = supabase.channel(
      `${RideConstants.channel.ride_accepting}${riderRideDetails?._id}`
    );

   channel
      .on(
        "broadcast",
        { event: RideConstants.event.ride_accepted },
        (payload) => {
          const ride = payload?.payload;
          console.log("====================================");
          console.log("accepting......", {
            requestId: riderRideDetails?._id,
            ride,
          });
          console.log("====================================");
          // dispatch(setState({key:'counterFareStatus', value: 'accepted' as TRideStatus}))

          const tickets = ticketsDetails.map((ticketItem) => {
            if (Number(ticketItem?.number) == Number(ticket?.number)) {
              return {
                ...ticket,
                ticketStatus: 'accepted'
              }
            }
            else return ticket;
          });

          console.log({tickets, new: 'yes'})

          // dispatch(setStateInputField({key:'ticketsDetails', value: tickets}))
  
        //   if (
        //     String(ride?._id) == String(riderRideDetails?._id)
        //   ) {
        //     dispatch(setState({key:'counterFareStatus', value: 'accepted' as TRideStatus}))
        //   }
        }
      )
      .subscribe();

  // if (counterFareStatus === "idle")
  if (ticket.ticketStatus === "idle")
    return (
      <TouchableOpacity
        onPress={negotiateTicketFare}
        style={[
          flex,
          gap(16),
          itemsCenter,
          justifyCenter,
          w("40%"),
          h(50),
          pl(16),
          rounded(10),
          bg(Colors.light.banner),
          { borderWidth: 0.7, borderColor: Colors.light.banner },
        ]}
      >
        <Text style={[neurialGrotesk, fw700, fs16, colorWhite]}>Request</Text>
      </TouchableOpacity>
    );
  // if (counterFareStatus === "pending")
  if (ticket.ticketStatus === "pending" as any)
    return (
      <View
        style={[
          flex,
          gap(16),
          itemsCenter,
          justifyCenter,
          w("40%"),
          h(50),
          pl(16),
          rounded(10),
          bg(colors.white),
          { borderWidth: 0.7, borderColor: Colors.light.banner },
        ]}
      >
        <Text style={[neurialGrotesk, fw700, fs16, c(Colors.light.banner)]}>
          Pending
        </Text>
      </View>
    );
  if (counterFareStatus === "accepted")
    return (
      <View
        style={[
          flex,
          gap(16),
          itemsCenter,
          justifyCenter,
          w("40%"),
          h(50),
          pl(16),
          rounded(10),
          bg(colors.white),
          { borderWidth: 0.7, borderColor: "#27AE65" },
        ]}
      >
        <Text style={[neurialGrotesk, fw700, fs16, c("#27AE65")]}>
          Accepted
        </Text>
      </View>
    );
}

export default CounterFareCtaBtn;
