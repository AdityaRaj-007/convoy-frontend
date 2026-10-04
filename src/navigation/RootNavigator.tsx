import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

import {useAuth} from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

const RootNavigator = () => {
    const {isLoading, isAuthenticated} = useAuth();

    if(isLoading) {
        return (
            <View style = {styles.loadingContainer}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    if(isAuthenticated) {
        return <MainNavigator/>
    }

    return <AuthNavigator/>
}

const styles= StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default RootNavigator;