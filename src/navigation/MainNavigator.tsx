import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CreateRideScreen from "../screens/CreateRideScreen";
import {Region} from 'react-native-apps';
import {Destination} from "../types/destination";
import DestinationPickerScreen from "../screens/DestinationPickerScreen";
import {RideDetails} from "../types/rides";
import RideDetailScreen from "../screens/RideDetailScreen"

export type MainStackParamsList = {
    Home: undefined;
    DestinationPicker:{
        initialRegion: Region;
    }
    CreateRide: {
        destination?: Destination;
    }
    RideDetail: {
        rideDetails?: RideDetails;
    }
};

const Stack = createNativeStackNavigator<MainStackParamsList>();

const MainNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="DestinationPicker" options={{title: 'Choose Destination', headerShown: false}}>
                {({navigation, route}) => (
                    <DestinationPickerScreen
                        initialRegion={route.params.initialRegion}
                        onConfirm={destination => {
                            navigation.navigate('CreateRide', {destination});
                        }}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="CreateRide" options={{title: "Create Ride"}}>
                {({navigation, route}) => (
                    <CreateRideScreen
                        destination={route.params.destination}
                        onConfirm = {rideDetails => {
                            navigation.navigate('RideDetail', {rideDetails})
                        }}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="RideDetail" options={{title: 'Ride Detail'}}>
                {({navigation, route}) => (
                    <RideDetailScreen
                        rideDetails = {route.params.rideDetails}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    )
}

export default MainNavigator;