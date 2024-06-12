import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://10.0.2.2:8000/api/hello/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
};

export default App;
