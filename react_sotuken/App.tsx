// App.js
import React from 'react';
import { View } from 'react-native';
// import CameraComponent from './src/components/CameraComponent';
import RESTComponent from './src/components/RESTComponent';

const App = () => {

  return (
    <View style={{ flex: 1 }}>
      <RESTComponent />
      
    </View>
  );
};

export default App;
