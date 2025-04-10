import { IDriverDetails } from "./driver";
import { IBusStop, IPlan, IRide, IRiderRideDetails, IRoute, IUnitFare, TTicketInputSatus } from "./ride";
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
  | "paused"
  | "booked"
  | "ended";

export interface ISavedBusStop {
  userId: string;
  busstopTitle: string;
  busStop: IBusStop;
}

export interface ILoading {
  status: TLoadingStatus;
  type: TLoadingType;
}

export interface ITicketInput {
  id?: string;
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

export interface ICurrentTrip {
  _id: string;
  driverId: string;
  driver?: IUser;
  availableSeats: number;
  vehicleName: string;
  inRideDropoffs: IBusStop[];
  ridersRides: IRiderRideDetails[];
  departureDate: string;
  departureTime: string;
  routeId: string;
  route?: IRoute;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITripState {
  loading: ILoading;
  booking: boolean;
  searchMatchBusstops: IBusStop[] | [];
  currentRideView: TCurrentrideView;
  riderRideDetails: IRiderRideDetails | null;
  paidTickets: ITicketInput[];
  driverDetails: IUser | null;
  userTrip: {
    riderRideDetails: IRiderRideDetails;
    currentTrip: ICurrentTrip;
  } | null;
  tripId: string;
  differentTickets: ITicket[];
  sameTickets: ITicket[];
  availableTrips: ICurrentTrip[] | [];
  selectedAvailableTrip: ICurrentTrip | null;
  currentNumberOfTickets: number;
  activeTab: TActiveTab;
  stateInput: IStateInput;
  currentTicket: ITicketInput | null;
  counterFareStatus: TCounterFareStatus;
  allTicketsFilled: boolean;
  ticketsInputs: ITicketInput[];
  paymentOptionInput: string;
  pickupBusstopInput: IBusStop | null;
  dropoffBusstopInput: IBusStop | null;
  ticketDetailsShown: boolean;
  duration: { text: string; value: string } | null;
  price: string;
  seats: number[];
  ridePlans: IPlan[];
  paymentOptionsVisible: boolean;
  currentTrip: null | ICurrentTrip;
  route: IRoute | null;
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
