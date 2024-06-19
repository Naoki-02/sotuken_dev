import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
// type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
    // route: HomeScreenRouteProp;
};

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Post Message"
                    onPress={() => navigation.navigate('PostMessage')}
                />
                <Button
                    title="Get Message"
                    onPress={() => navigation.navigate('GetMessage')}
                />
                <Button
                    title="Camera"
                    onPress={() => navigation.navigate('Camera')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%', // ボタン幅を調整
    },
});
