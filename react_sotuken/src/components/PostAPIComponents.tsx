import axios from 'axios';
import React from 'react';
import { Button, View } from 'react-native';

export default function App() {
    const sendPostRequest = () => {
        // axios.post('http://10.0.2.2:8000/api/post/', { message: 'Hello, Django' })
        axios.post('https://3c4d-202-250-70-9.ngrok-free.app/api/post/', { message: 'Hello, Django' })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Send Message" onPress={sendPostRequest} />
        </View>
    );
}
