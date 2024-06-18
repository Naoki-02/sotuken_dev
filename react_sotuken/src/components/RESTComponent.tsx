import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // axios.get('http://10.0.2.2:8000/api/get/')
    axios.get('https://3c4d-202-250-70-9.ngrok-free.app/api/get/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <View style={Styles.container}>
      <Text style={Styles.messageText}>{message}</Text>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 40,
    color: 'black',
  },
});

export default App;
