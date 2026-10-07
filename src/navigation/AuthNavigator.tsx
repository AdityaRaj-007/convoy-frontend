import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from "../screens/LoginScreen";
import OTPScreen from "../screens/OTPScreen";
import RegisterScreen from "../screens/RegisterScreen";

export type AuthStackParamList = {
    Login: undefined;
    OTP: {
        phoneNumber: string;
    },
    Register: {
        verificationToken: string;
    }
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name = "Login" component = {LoginScreen} options = {{headerShown: false}}/>
            <Stack.Screen name = "OTP" component = {OTPScreen} options = {{title: "Verify OTP"}} />
            <Stack.Screen name = "Register" component = {RegisterScreen} options = {{title: "Create Account"}}/>
        </Stack.Navigator>
    )
}

export default AuthNavigator;