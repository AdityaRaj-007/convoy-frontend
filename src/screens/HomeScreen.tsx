import {View, Text, StyleSheet, Button} from 'react-native';
import {useNavigation} from "@react-navigation/native";


const HomeScreen = () => {
    const navigation = useNavigation();
    return (<View style={styles.container}>
        <Text style={styles.title}>Convoy</Text>
        <Button title="Create Ride" onPress={() => navigation.navigate('CreateRide')}/>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24
    }
})

export default HomeScreen