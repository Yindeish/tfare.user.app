import Colors, { colors } from "@/constants/Colors";
import { RideConstants } from "@/constants/ride";
import tw from "@/constants/tw";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useReduxToolkit";
import RideSelectors from "@/state/selectors/ride";
import {
  setCounterFareStatus,
  setState,
  setStateInputField,
} from "@/state/slices/ride";
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

function CounterFareCtaBtn({
  fetchState,
  setFetchState,
  ticket,
}: {
  // negotiateTicketFare: () => Promise<void>;
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
  ticket: ITicketInput;
}) {
  const dispatch = useAppDispatch();
  const {
    counterFareStatus,
    riderRideDetails,
    currentTicket,
    stateInput: { ticketsDetails },
  } = useAppSelector((state: RootState) => state.ride);

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
          if (Number(ticketItem?.number) == Number(currentTicket?.number)) {
            return {
              ...ticket,
              ticketStatus: "accepted",
            };
          } else return ticket;
        });

        console.log({ tickets, new: "yes" });

        dispatch(setStateInputField({ key: "ticketsDetails", value: tickets }));

        //   if (
        //     String(ride?._id) == String(riderRideDetails?._id)
        //   ) {
        //     dispatch(setState({key:'counterFareStatus', value: 'accepted' as TRideStatus}))
        //   }
      }
    )
    .subscribe();

    const negotiateTicketFare = async () => {
    
      dispatch(setState({key:'currentTicket', value: ticket}));
      console.log({ticket, currentTicket})
      // if(Number(currentTicket?.number) != Number(ticket?.number)) dispatch(setCurrentTicket(ticket));
        
      
      setTimeout(() => {
        // console.log({ticket, currentTicket})
      }, 2000)
      // setFetchState((prev) => ({ ...prev, loading: true }));
  
      // const dropoffPlan = currentRoute?.inTripDropoffs?.find((dropoff) => String(dropoff?._id) === String(dropoffBusstopInput?._id))?.plan;
  
      // const returnedData = await FetchService.postWithBearerToken({
      //   url: `/user/rider/me/ride/${selectedAvailableRide?._id}/negotiate-fare`,
      //   data: {
      //     pickupBusstopId: pickupBusstopInput?._id,
      //     dropoffBusstopId: dropoffBusstopInput?._id,
      //     userCounterOffer: userCounterFareInput,
      //     ridePlan: dropoffPlan?.ride?.rideFee || dropoffPlan?.plan?.ride?.rideFee,
      //     routeId: dropoffPlan?.routeId,
      //   },
      //   token: token as string,
      // });
  
      // const code = returnedData?.code;
      // const msg = returnedData?.msg;
      // const userRideSaved = returnedData?.userRideSaved || returnedData?.riderRide;
  
      // setFetchState((prev) => ({
      //   ...prev,
      //   loading: false,
      //   msg,
      //   code,
      // }));
  
      // if (code == 201 || code == 200) {
      //   const tickets = ticketsDetails.map((ticketItem) => {
      //     if(Number(ticketItem?.number) == ticketNumber) {
      //       return {
      //         ...ticketItem,
      //         ticketStatus: 'pending'
      //       }
      //     }
      //     else return ticketItem;
      //   })
  
      //   dispatch(setStateInputField({key:'ticketsDetails', value: tickets}));
      //   dispatch(setCurrentTicket(ticket))
      //   dispatch(setState({ key: "riderRideDetails", value: userRideSaved }));
      //   // dispatch(setState({key:'counterFareStatus', value: 'pending'}))
      // }
    }

  return (
    <View style={tw `w-[40%]`}>
      {ticket.ticketStatus === "idle" ? (
        <TouchableOpacity
          onPress={() => negotiateTicketFare()}
          style={[
            flex,
            gap(16),
            itemsCenter,
            justifyCenter,
            w("100%"),
            h(50),
            pl(16),
            rounded(10),
            bg(Colors.light.banner),
            { borderWidth: 0.7, borderColor: Colors.light.banner },
          ]}
        >
          <Text style={[neurialGrotesk, fw700, fs16, colorWhite]}>Request</Text>
        </TouchableOpacity>
      ) : ticket.ticketStatus === ("accepted" as any) ? (
        <View
          style={[
            flex,
            gap(16),
            itemsCenter,
            justifyCenter,
            w("100%"),
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
      ) : (
        <View
          style={[
            flex,
            gap(16),
            itemsCenter,
            justifyCenter,
            w("100%"),
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
      )}
    </View>
  );

  // if (counterFareStatus === "idle")
  // if (ticket.ticketStatus === "idle")
  //   return (
  //     <TouchableOpacity
  //       onPress={negotiateTicketFare}
  //       style={[
  //         flex,
  //         gap(16),
  //         itemsCenter,
  //         justifyCenter,
  //         w("40%"),
  //         h(50),
  //         pl(16),
  //         rounded(10),
  //         bg(Colors.light.banner),
  //         { borderWidth: 0.7, borderColor: Colors.light.banner },
  //       ]}
  //     >
  //       <Text style={[neurialGrotesk, fw700, fs16, colorWhite]}>Request</Text>
  //     </TouchableOpacity>
  //   );
  // // if (counterFareStatus === "pending")
  // if (ticket.ticketStatus === ("pending" as any))
  //   return (
  //     <View
  //       style={[
  //         flex,
  //         gap(16),
  //         itemsCenter,
  //         justifyCenter,
  //         w("40%"),
  //         h(50),
  //         pl(16),
  //         rounded(10),
  //         bg(colors.white),
  //         { borderWidth: 0.7, borderColor: Colors.light.banner },
  //       ]}
  //     >
  //       <Text style={[neurialGrotesk, fw700, fs16, c(Colors.light.banner)]}>
  //         Pending
  //       </Text>
  //     </View>
  //   );
  // if (ticket.ticketStatus === ("accepted" as any))
  //   return (
  //     <View
  //       style={[
  //         flex,
  //         gap(16),
  //         itemsCenter,
  //         justifyCenter,
  //         w("40%"),
  //         h(50),
  //         pl(16),
  //         rounded(10),
  //         bg(colors.white),
  //         { borderWidth: 0.7, borderColor: "#27AE65" },
  //       ]}
  //     >
  //       <Text style={[neurialGrotesk, fw700, fs16, c("#27AE65")]}>
  //         Accepted
  //       </Text>
  //     </View>
  //   );
}

export default CounterFareCtaBtn;
