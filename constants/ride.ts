
const bottomSheetqueries = {
    RecentLocationsSnippet: 'RecentLocationsSnippet',
    RecentPickupLocations: 'RecentPickupLocations',
    RecentDropoffLocations: 'RecentDropoffLocations',
    FilledForm: 'FilledForm',
    RideRouteDetails: 'RideRouteDetails',
    SearchingRide: 'SearchingRide',
    RideBooked: 'RideBooked',
    RideStarted: 'RideStarted',
    RideEnded: 'RideEnded',
    RideDeclined: 'RideDeclined',
    TripDetails: 'TripDetails',
}

const channels = {
    ride_accepting: 'ride_accepting_',
    ride_booking: 'ride_booking_',
    ride_starting: 'ride_starting_',
    ride_pausing: 'ride_pausing_',
    ride_requesting: 'ride_requesting_',
    ride_ending: 'ride_ending_',
    ride_cancelling: 'ride_cancellining_',
    ride_declining: 'ride_declining_',
}

const events = {
    ride_accepted: 'ride_accepted',
    ride_booked: 'ride_booked',
    ride_started: 'ride_started',
    ride_paused: 'ride_paused',
    ride_requested: 'ride_requested',
    ride_ended: 'ride_ended',
    ride_declined: 'ride_declined',
    ride_cancelled: 'ride_cancelled',
}

export const RideConstants = {
    localDB: {
        query: 'query'
    },
    query: bottomSheetqueries,
    event: events,
    channel: channels
}