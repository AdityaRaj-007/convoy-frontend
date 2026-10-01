import {View, Text, StyleSheet} from 'react-native';

const CreateRideScreen = () => {
    return (
        <View style = {styles.container}>
            <Text style = {styles.title}>Create Ride</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold'
    }
})

export default CreateRideScreen