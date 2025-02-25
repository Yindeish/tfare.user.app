import { IDriverDetails } from "./driver";
import { IUser } from "./user";

type TLoadingStatus = "idle" | "succeeded" | "failed";
type TLoadingType = string;
type TCurrentrideView = "orderRide" | "availableRides";
type TActiveTab = "pending" | "completed" | "cancelled";
type TCounterFareStatus = "idle" | "pending" | "accepted" | "rejected";

type TBusStop = "pickupBusstop" | "dropoffBusstop";
export type TPlanName = "standard" | "premium";
export type TCategoryOrigin = "ajah" | "lekki" | "obalende" | "cms";
export type TCategoryDestination = "lekki" | "obalende" | "cms" | "oshodi";
export type TRideDirection = "forward" | "backward";
export type TRideStatus =
  | "requesting"
  | "cancelled"
  | "accepted"
  | "declined"
  | "started"
  | "booked"
  | "ended";

export interface IRoute {
  routeName: string;
  routeDesc: string;
  routeDistance: string;
}

export interface IBusStop {
  _id?: string;
  name: string;
  order?: {
    forward: { number: number };
    backward: { number: number };
  };
  category?: {
    origin: TCategoryOrigin;
    destination: TCategoryDestination;
  };
}

export interface ISavedBusStop {
  userId: string;
  busstopTitle: string;
  busStop: IBusStop;
}

export interface IRoute {
  _id: string;
  pickupBusstopId: string;
  dropoffBusstopId: string;
  rideDirection: "forward" | "backward";
  inTripDropoffsIds: string[];
}

export interface IRecentBusStop {
  userId: string;
  busStop: IBusStop;
}

export interface ILoading {
  status: TLoadingStatus;
  type: TLoadingType;
}

export interface ITicketInput {
  id?: string;
  owner?: {};
  ticketOtp: string;
  pickupBusstop?: IBusStop | null;
  dropoffBusstop?: IBusStop | null;
  time?: string;
  sameAsFirstTicket?: boolean;
  number: number;
  userCounterFare?: number | null;
  rideFee?: number;
}

export interface ITicket {
  createdAt: Date,
  quantity: string,
  ride: string,
  riderCounterOffer: string,
  riderId: string,
  ticketOtp: string,
  ticketStatus: string,
  updatedAt: string,
  _id: string,
}

export interface IStateInput {
  pickupBusstopInput: IBusStop | null;
  dropoffBusstopInput: IBusStop | null;
  userCounterFareInput: number | null;
  driverRatingInput: number | null;
  driverRatingCommentInput: string;
  cancelRideReasonInput: string;
  userRideInput: Partial<IRide>;
  paymentOptionInput: string;

  //
  selectedPlan: IPlan | null;
}
// ? Ride

export interface IPlan {
  routeId: string;
  planName: TPlanName;
  vehicleSeats: number;
  ride?: {
    rideFee: number;
  };
  trip?: {
    tripFee: number;
  };
}

export interface ICurrentRide {
  _id: string;
  driverId: string;
  availableSeats: number;
  vehicleName: string;
  inRideDropoffs: IBusStop[];
  ridersRides: IRiderRideDetails[];
}

export interface IRiderRideDetails {
  _id: string;
  pickupBusstop: IBusStop;
  dropoffBusstop: IBusStop;
  riderId: string;
  ticketsIds: string[];
  duration: string;
  ridePlan: IPlan;
  rideStatus: TRideStatus;
  riderCounterOffer: number;
  currentRideId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRide {
  _id?: string;
  pickupBusstop: IBusStop;
  dropoffBusstop: IBusStop;
  saved: boolean;
  tickets?: ITicketInput[] | [];
  status: "idle" | "cancelled" | "accepted" | "started";
  duration?: string;
  availableSeats?: number;
  seats?: number;
  driverDetails?: IDriverDetails;
  busStops?: IBusStop[] | [];
}

export interface IPlan {
  routeId: string;
  plan: {
    ride: {
      rideFee: number;
    };
    planName: "standard";
    serviceFee: number;
    riderTolerance: number;
    driverTolerance: number;
    vehicleSeats: number;
    _id: string;
  };
}

export interface IRideState {
  loading: ILoading;
  booking: boolean;
  searchMatchBusstops: IBusStop[] | [];
  currentRideView: TCurrentrideView;
  // userRide: IRiderRideDetails | null,
  riderRideDetails: IRiderRideDetails | null;
  paidTickets: ITicketInput[];
  driverDetails: IUser | null;
  userRide: {
    riderRideDetails: IRiderRideDetails;
    currentRide: ICurrentRide;
  } | null;
  tripId: string;
  differentTickets: ITicket[];
  // sameTickets: ITicket | null;
  sameTickets: ITicket[];
  //   availableRides:
  //     | { riderRideDetails: IRiderRideDetails; currentRide: ICurrentRide }[]
  //     | [];
  availableRides: ICurrentRide[] | [];
  selectedAvailableRide: ICurrentRide | null;
  currentNumberOfTickets: number;
  activeTab: TActiveTab;
  stateInput: IStateInput;
  currentTicket: ITicketInput | null;
  counterFareStatus: TCounterFareStatus;
  allTicketsFilled: boolean;
  ticketDetailsShown: boolean;
  duration: { text: string; value: string } | null;
  price: string;
  seats: number[];
  ridePlans: IPlan[];
  paymentOptionsVisible: boolean;
}
// ? Ride

export type {
  TBusStop,
  TLoadingStatus,
  TLoadingType,
  TCurrentrideView,
  TActiveTab,
  TCounterFareStatus,
};
