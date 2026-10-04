import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from "../screens/LoginScreen";
import OTPScreen from "../screens/OTPScreen";

export type AuthStackParamList = {
    Login: undefined;
    OTP: {
        phoneNumber: string;
    }
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name = "Login" component = {LoginScreen} options = {{headerShown: false}}/>
            <Stack.Screen name = "OTP" component = {OTPScreen} options = {{title: "Verify OTP"}} />
        </Stack.Navigator>
    )
}