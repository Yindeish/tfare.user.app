// App.js or a specific component

import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import socket from './socketIO.config';

const App = () => {
    const [rideRequests, setRideRequests] = useState([]);
    const [acceptedRides, setAcceptedRides] = useState([]);

    useEffect(() => {
        // Listen for new ride requests
        socket.on('newRideRequest', (data) => {
            console.log('New ride request:', data);
            setRideRequests((prevRequests: any) => [...prevRequests, data]);
            Alert.alert('New Ride Request', 'A new ride request has been made.');
        });

        // Listen for ride acceptance
        socket.on('rideRequestAccepted', (data) => {
            console.log('Ride request accepted:', data);
            setAcceptedRides((prevRides: any) => [...prevRides, data]);
            Alert.alert('Ride Request Accepted', 'Your ride request has been accepted.');
        });

        // Clean up the event listeners on unmount
        return () => {
            socket.off('newRideRequest');
            socket.off('rideRequestAccepted');
        };
    }, []);

    return (
        <View>
            <Text>Ride Requests:</Text>
            {rideRequests.map((request, index) => (
                <Text key={index}>{JSON.stringify(request)}</Text>
            ))}

            <Text>Accepted Rides:</Text>
            {acceptedRides.map((ride, index) => (
                <Text key={index}>{JSON.stringify(ride)}</Text>
            ))}
        </View>
    );
};

export default App;
