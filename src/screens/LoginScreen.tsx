import {useNavigation} from "@react-navigation/native";
import React, {useState} from 'react';
import {Alert, View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {sendOTP} from "../services/Auth/auth.service";

const LoginScreen = () => {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async() => {
        if(!phoneNumber.trim()) {
            Alert.alert('Error', 'Please enter your phone number.');
            return;
        }

        try {
            isLoading(true);

            await sendOTP(phoneNumber.trim());

            navigation.navigate('OTP', {phoneNumber: phoneNumber.trim()});
        }catch(err) {
            Alert.alert('Unable to send OTP',
                err instanceof Error ? err.message :
                    'Something went wrong.'
            );
        }finally {
            isLoading(false);
        }
    }

    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>Convoy</Text>
            <Text style = {styles.subtitle}>Enter your phone number</Text>
            <TextInput placeholder= "Phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />

            <Button title = {isLoading ? 'Sending...' : 'Continue'}
                onPress={handleSendOTP}
                disabled={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        marginTop: 12,
        marginBottom: 24,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16
    }
});

export default LoginScreen;