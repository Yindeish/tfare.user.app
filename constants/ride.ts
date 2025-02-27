
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
    RideDeclined: 'RideDeclined'
}

const channels = {
    ride_accepting: 'ride_accepting',
    ride_starting: 'ride_starting',
    ride_ending: 'ride_ending',
}

const events = {
    ride_accepted: 'ride_accepted',
    ride_started: 'ride_started',
    ride_ended: 'ride_ended',
}

export const RideConstants = {
    localDB: {
        query: 'query'
    },
    query: bottomSheetqueries,
    event: events,
    channel: channels
}