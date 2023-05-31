/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { init } from "./src/utils/database";
import { useContext, useEffect } from "react";
import LoginScreen from "./src/screens/LoginScreen";
import AuthContextProvider, { AuthContext } from "./src/store/auth-context";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from "./src/constants/colors";
import WelcomeScreen from "./src/screens/WelcomScreen";
import IconButton from "./src/components/IconButton";

const Stack = createNativeStackNavigator();

function App() {

  useEffect(() => {
    // Initialize the database on app load
    init()
      .then(() => {
        console.log('Users table created');
      })
      .catch(() => {
        console.log('Database table creation failed');
      });
  }, []);

  // Stack for screens after authentication
  function AuthenticatedStack() {
    const authCtx = useContext(AuthContext);

    return (
      <Stack.Navigator
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: Colors.primary500 },
          headerShown: true,
        }}
      >
        <Stack.Screen
          name='WelcomeScreen'
          component={WelcomeScreen}
          options={{
            headerShown: true,
            headerRight: ({ tintColor }) => (
              <IconButton
                icon='exit'
                color={tintColor}
                size={24}
                onPress={authCtx.logout}
              />
            ),
          }}
        />
      </Stack.Navigator>
    );
  }

  // Stack for authentication screens
  function AuthStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'black' },
          headerShown: true,
        }}
      >
        <Stack.Screen
          name='LoginScreen'
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }

  // Main navigation component
  function Navigation() {
    const authCtx = useContext(AuthContext);

    return (
      <NavigationContainer>
        {authCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
      </NavigationContainer>
    );
  }

  return (
    <>
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}

export default App;
