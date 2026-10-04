import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CreateRideScreen from "../screens/CreateRideScreen";

export type MainStackParamsList = {
    Home: undefined;
    CreateRide: undefined
};

const Stack = createNativeStackNavigator<MainStackParamsList>();

const MainNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{title: "Convoy"}}/>
            <Stack.Screen name="CreateRide" component={CreateRideScreen} options={{title: "Create Ride"}}/>
        </Stack.Navigator>
    )
}

export default MainNavigator;