import React from 'react'
import { View, Text, Button } from 'react-native'
import { StyleSheet } from 'react-native'


export default props => (
    <View style={styles.container}>
        <Text style={styles.text}>Login Tela</Text>
        <Button title='Fazer Login' onPress={() => props.navigation.navigate('Home')} />
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000'
    },
    text: {
        color: '#fff'
    }
})