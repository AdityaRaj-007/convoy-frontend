import React , {useState} from 'react';
import {verifyOTP} from "../services/Auth/auth.service";
import {Alert, View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useAuth} from "../context/AuthContext";
import {useNavigation} from "@react-navigation/native";

type Props = {
    route: {
        params: {
            phoneNumber: string;
        }
    }
}
const OTPScreen = ({route}: Props) => {
    const {phoneNumber} = route.params;
    const {authenticate} = useAuth();
    const navigation = useNavigation();

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyOTP = async () => {
        try {
            setIsLoading(true);

            const result = await verifyOTP(phoneNumber, otp);

//          Alert.alert('Success', 'OTP verified.');

            if('isNewUser' in result) {
                navigation.navigate('Register', {verificationToken: result.verificationToken});
            }

            authenticate(result);

        } catch(err) {
            console.log("Verification error : ", err);
            Alert.alert('Verification failed',
                    err instanceof Error ? err.message: 'Something went wrong'
            );
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <View>
            <Text>Enter OTP</Text>
            <Text> OTP sent to {phoneNumber}</Text>

            <TextInput placeholder="OTP"
                keyboardType = "number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength = {6}
            />

            <Button title={isLoading? 'Verifying...' : 'Verify'}
                onPress={handleVerifyOTP}
                disabled={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
    }
})

export default OTPScreen;