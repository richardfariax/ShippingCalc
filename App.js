import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Freights from "./screens/Freights";
import Freight from "./screens/Freight";
import Register from "./screens/Register";
import CreateFreight from "./screens/CreateFreight";
import { setupDatabase } from "./model/database";

const StackNavigation = createNativeStackNavigator();
setupDatabase();

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigation.Navigator initialRouteName="Login">
        <StackNavigation.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <StackNavigation.Screen
          options={{ animation: "slide_from_bottom", title: "Fretes" }}
          name="Freights"
          component={Freights}
        />
        <StackNavigation.Screen
          name="Freight"
          component={Freight}
          options={{ animation: "slide_from_bottom" }}
        />
        <StackNavigation.Screen
          name="Register"
          component={Register}
          options={{
            title: "",
          }}
        />
        <StackNavigation.Screen
          name="CreateFreight"
          component={CreateFreight}
          options={{
            animation: "slide_from_bottom",
            title: "",
          }}
        />
      </StackNavigation.Navigator>
    </NavigationContainer>
  );
}
