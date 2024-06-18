// // App.js
// import React from 'react';
// import { View } from 'react-native';
// // import CameraComponent from './src/components/CameraComponent';
// import RESTComponent from './src/components/RESTComponent';

// const App = () => {

//   return (
//     <View style={{ flex: 1 }}>
//       <RESTComponent />
      
//     </View>
//   );
// };

// export default App;
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import 'react-native-gesture-handler';
import PostMessageScreen from './src/components/PostAPIComponents';
import GetMessageScreen from './src/components/RESTComponent';
import HomeScreen from './src/pages/Home';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PostMessage" component={PostMessageScreen} />
        <Stack.Screen name="GetMessage" component={GetMessageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
