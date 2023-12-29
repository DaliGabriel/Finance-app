// You can import Ionicons from @expo/vector-icons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Card, Icon } from '@rneui/themed';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';

function HomeScreen() {

  return (
    <View style={styles.textContent}>
      <Text
        style={{
          fontFamily: "Poppins-Bold",
          fontSize: 30,
          paddingTop: 30,
          paddingLeft: 20,
        }}
      >
        !Bienvenido! 👋
      </Text>
      <Text
        style={{
          paddingTop: 20,
          paddingLeft: 20,
          fontSize: 40,
          fontFamily: "Poppins-Bold",
        }}
      >
        Balance total
      </Text>

      {/* Card de balance total */}
      <Card
        //*Estilos del card
        containerStyle={{
          borderColor: "black",
          borderWidth: 2,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            fontSize: 50,
            fontFamily: "Poppins-Medium",
          }}
        >
          $66699
        </Text>
      </Card>

      <View style={styles.twoColumns}>
        {/* Card de ingresos */}
        <Card
          containerStyle={{
            borderColor: "green",
            borderWidth: 2,
            borderRadius: 8,
            width: '30%'
          }}
        >
          <Icon name="arrow-upward" color="green" />
          <Card.Title>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins-Medium",
                color: "black",
              }}
            >
              Ingresos
            </Text>
          </Card.Title>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Poppins-Medium",
              color: "black",
              textAlign: "center",
            }}
          >
            $666
          </Text>
        </Card>

        {/* Card de egresos */}
        <Card
          containerStyle={{
            borderColor: "red",
            borderWidth: 2,
            borderRadius: 8,
            width: '30%'
          }}
        >
          <Icon name="arrow-downward" color="red" />

          <Card.Title>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins-Medium",
                color: "black",
              }}
            >
              Egresos
            </Text>
          </Card.Title>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Poppins-Medium",
              color: "black",
              textAlign: "center",
            }}
          >
            $ 666
          </Text>
        </Card>
      </View>
    </View>
  );
}

function AddScreen() {
  return (
    <View style={styles.textCenter}>
      <Text>Add</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Add") {
                iconName = "add-circle-sharp";
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            //Configuracion de colores
            tabBarActiveTintColor: "green",
            tabBarInactiveTintColor: "gray",
          })}
        >
          {/*Elementos visualez*/}
          <Tab.Screen name="Home" component={HomeScreen}  />
          <Tab.Screen name="Add" component={AddScreen} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}

const styles = {
  textContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  twoColumns:{ 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
};
