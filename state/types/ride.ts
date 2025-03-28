import { IDriverDetails } from "./driver";
import { IUser } from "./user";

type TLoadingStatus = "idle" | "succeeded" | "failed";
type TLoadingType = string;
type TCurrentrideView = "orderRide" | "availableRides";
type TActiveTab = "pending" | "completed" | "cancelled";
type TCounterFareStatus = "idle" | "pending" | "accepted" | "rejected";
type TAllowedPaymentOptions = "cash" | "online" | "wallet" | "point";

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
  | "paused"
  | "booked"
  | "ended";
  export type TTicketSatus = 'idle' | 'cancelled' | 'paid' | 'booked' | 'declined';
  export type TTicketInputSatus = 'idle' | 'pending' | 'accepted' | 'paid' | 'booked' | 'declined';

export interface IRoute {
  // routeName: string;
  // routeDesc: string;
  // routeDistance: string;
  _id: string;
  pickupBusstop: IBusStop;
  dropoffBusstop: IBusStop;
  inTripDirection: "forward" | "backward";
  city: ICity;
  inTripDropoffs: IBusStop[],
  unitFares: IUnitFare[];
  editable: boolean;
  active: boolean;
  allowedPaymentOptions: TAllowedPaymentOptions[];
}

export interface ICity {
  _id: string;
  name: string;
  stateName: string;
}

export interface IBusStop {
  _id?: string;
  name: string;
  order?: number;
  city: ICity;
}

export interface ISavedBusStop {
  userId: string;
  busstopTitle: string;
  busstop: IBusStop;
}

export interface IUnitFare {
  pickupBusstopId: string;
  dropoffBusstopId: string;
  plan: IPlan;
  _id: string;
}

// export interface IRoute {
//   // _id: string;
//   // pickupBusstopId: string;
//   // dropoffBusstopId: string;
//   ///^^^^^^^************
//   // pickupBusstop: IBusStop;
//   // dropoffBusstop: IBusStop;
//   // rideDirection: "forward" | "backward";
//   // inTripDropoffsIds?: string[];
//   // inTripDropoffs?: {
//   //   name: string;
//   //   city: ICity;
//   //   order: number;
//   //   plan: IPlan;
//   //   _id: string;
//   // }[];
//   // unitFares?: IUnitFare[]
// }

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
  serviceFee?: number;
  ticketStatus?: TTicketInputSatus;
  unitFare?: IUnitFare;
  rideId?: string;
  quantity?: number;
}

export interface ITicket {
  riderId: string,
  riderCounterOffer: number,
  quantity: number,
  ticketOtp: number,
  ticketStatus: TTicketSatus,
  ride?: {
      currentRideId: string,
      riderRideDetailsId: string,
      ridePlan: IPlan,
      rideFee: number
  },
  trip?: {
      currentTripId: string,
      riderTripDetailsId: string,
      tripPlan: IPlan,
      tripFee: number
  },
  createdAt: Date,
  updatedAt: Date
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
  ticketsDetails: ITicketInput[];
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
  serviceFee?: number;
}

export interface ICurrentRide {
  _id: string;
  driverId: string;
  availableSeats: number;
  vehicleName: string;
  inRideDropoffs: IBusStop[];
  ridersRides: IRiderRideDetails[];
  routeId?: string;
  route?: IRoute; 
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
  lastRides: IRiderRideDetails[],
  currentRideUnderNegotiation: IRiderRideDetails | null,
  currentRoute: IRoute | null,
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
