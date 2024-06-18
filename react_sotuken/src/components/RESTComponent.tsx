import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://10.0.2.2:8000/api/get/')
    // axios.get('https://ce4b-202-250-70-11.ngrok-free.app/api/hello/')
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
  },
});

export default App;
