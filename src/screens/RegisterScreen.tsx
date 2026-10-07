import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useAuth} from "../context/AuthContext";
import {registerUser} from "../services/Auth/auth.service";

type Props = {
    route: {
        params: {
            verificationToken: string;
        }
    }
}

const RegisterScreen = ({route}: Props) => {
    const {verificationToken} = route.params;

    const {authenticate} = useAuth();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if(!name.trim()) {
            Alert.alert('Error', 'Please enter your name.');
            return;
        }

        try {
            setIsLoading(true);

            const tokens = await registerUser(name.trim(), verificationToken);

            authenticate(tokens);
        } catch(err) {
            Alert.alert('Registration failed', err instanceof Error ? err.message : 'Something went wrong');
        } finally{
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style = {styles.title}>Create Account</Text>

            <Text style={styles.subtitle}>Enter your name</Text>

            <TextInput style={styles.input}
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!isLoading}
            />

            <Button title={isLoading? 'Creating...' : 'Continue'}
                onPress={handleRegister}
                disabled={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 16,
    }
})

export default RegisterScreen;