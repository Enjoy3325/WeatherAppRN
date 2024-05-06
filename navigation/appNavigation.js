import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox, Text, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";

const Stack = createStackNavigator();
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation;