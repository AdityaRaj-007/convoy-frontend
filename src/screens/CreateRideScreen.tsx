import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, TextInput, Keyboard, Alert} from 'react-native';
import {Destination} from "../types/destination";

type Props = {
    destination: Destination
}

const CreateRideScreen = ({destination}: Props) => {

    const [rideName, setRideName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateRide = () => {
        console.log("Destination : " + destination.name);
        Keyboard.dismiss();

        if(!destination.name.trim()){
            Alert.alert('Missing destination', 'Please select a destination.');
            return;
        }

        try {
            setIsCreating(true);


        }catch(error) {
            console.error('Failed to create ride : ', error);
            Alert.alert('Error', 'Unable to create the ride. Please try again.');
        } finally {
            setIsCreating(false);
        }
    }
    return (
        <View style = {styles.container}>
            <Text style= {styles.heading}>Create a Ride</Text>
            <Text style={styles.subtitle}>Set up your ride and invite your friends.</Text>

            <View style={styles.field}>
                <Text style={styles.label}>Ride name (optional)</Text>
                <TextInput
                    value={rideName}
                    placeholder="e.g. Weekend road trip"
                    placeholderTextColor='#777'
                    maxLength={60}
                    returnKeyType="done"
                    onChangeText={setRideName}
                    style={styles.input}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Destination</Text>
                <View style={styles.destinationCard}>
                    <Text style={styles.destinationName}>{destination.name}</Text>
                </View>
            </View>

            <Pressable style={[styles.createRideButton, isCreating && styles.disabledButton]}>
                <Text style={styles.createRideButtonText}>Create Ride</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'center'
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#202124'
    },
    subtitle: {
        marginTop: 8,
        marginBottom: 32,
        fontSize: 15,
        color: '#5f6368'
    },
    field: {
        marginBottom: 24,
    },
    label: {
      marginBottom: 10,
      fontSize: 15,
      fontWeight: '600',
      color: '#202124'
    },
    input: {
        minHeight: 52,
        borderWidth: 1,
        borderColor: '#dadce0',
        borderRadius: 12,
        paddingHorizontal: 14,
        fontSize: 16,
        color: '#202124',
    },
    destinationCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dadce0',
        backgroundColor: '#f8f9fa'
    },
    destinationName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#202124'
    },
    createRideButton: {
        minHeight: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1769e0'
    },
    createRideButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff'
    },
    disabledButton: {
        opacity: 0.65
    }
})

export default CreateRideScreen