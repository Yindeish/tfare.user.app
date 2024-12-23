import URLS from "@/constants/urls";
import { io } from "socket.io-client";

// export const socket = io(URLS.SOCKETIO_URL);
export const socket = io(URLS.SOCKETIO_URL, {
    transports: ['websocket'], // Prefer websocket transport
    secure: true,              // Enforce HTTPS
    withCredentials: true,
});

export const EVENTS = {
    connection: 'connect',
    disconnect: 'disconnect',
    driverOnline: 'driverOnline',
    rideRequestAccepted: 'rideRequestAccepted',
    newRideRequest: 'newRideRequest',
    rideCancelled: 'rideCancelled',
    rideDeclined: 'rideDeclined',
    rideStarted: 'rideStarted',
    rideEnded: 'rideEnded',
}