import React, {useState, useEffect} from 'react';
import {RideDetails} from "../types/rides";
import {View, Text, StyleSheet} from 'react-native';

type Props = {
    rideDetails: RideDetails
}

const RideDetailScreen = ({rideDetails}: Props) => {

    useEffect(() => {
        console.log("Ride Details Screen : " + JSON.stringify(rideDetails));
    }, [])

    return (
        <View style = {styles.container}>
            <Text style = {styles.label}>Ride Name</Text>
            <View style = {styles.rideNameCard}>
                <Text style = {styles.rideName}>
                    {rideDetails.rideName}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 24,
    },
    label: {
       marginBottom: 10,
       fontSize: 15,
       fontWeight: '600',
       color: '#202124'
    },
    rideNameCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dadce0',
        backgroundColor: '#f8f9fa'
    },
    rideName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#202124'
    }
})

export default RideDetailScreen;