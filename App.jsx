// You can import Ionicons from @expo/vector-icons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Card, Icon } from '@rneui/themed';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

//*Componente de la pantalla principal
function HomeScreen() {

  return (
    <View style={styles.textContent}>
      {/* Bienvenido */}
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
      {/* Balance total */}
      <Text
        style={{
          paddingTop: 10,
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
      {/* Cards de ingresos y egresos */}
      <View style={styles.twoColumns}>
        {/* Card de total de ingresos */}
        <Card
          containerStyle={{
            borderColor: "green",
            borderWidth: 2,
            borderRadius: 8,
            width: "30%",
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
        {/* Card de total de egresos */}
        <Card
          containerStyle={{
            borderColor: "red",
            borderWidth: 2,
            borderRadius: 8,
            width: "30%",
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

      {/* Registros*/}
      {/* Ultimos registros*/}
      <Text
        style={{
          paddingTop: 20,
          paddingLeft: 20,
          fontSize: 30,
          fontFamily: "Poppins-Bold",
        }}
      >
        Últimos registros
      </Text>

      {/* lista de registros */}
      <ScrollView
        style={{
          width: "100%",
        }}
      >
        {/*Carta de egresos*/}
        <Card>
          <View style={styles.cardContent}>
            <Icon
              name="cash-minus"
              type="material-community"
              size={40}
              color={"red"}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>Alimentos y bebidas</Text>
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                }}
              >
                Comida semana
              </Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amountIncome}>-$1,000</Text>
            </View>
          </View>
        </Card>

        {/*Carta de ingresos*/}
        <Card>
          <View style={styles.cardContent}>
            <Icon
              name="cash-plus"
              type="material-community"
              size={40}
              color={"green"}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>Salario</Text>
              <Text>Quincena</Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amountExpense}>+$7,000</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.cardContent}>
            <Icon
              name="cash-plus"
              type="material-community"
              size={40}
              color={"red"}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>Alimentos y bebidas</Text>
              <Text>Comida semana</Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amountIncome}>-$1,000</Text>
            </View>
          </View>
        </Card>

      </ScrollView>

    </View>
  );
}

//*Componente del formulario para añadir gastos e ingresos
function AddScreen() {

  const [formValues, setFormValues] = useState({
    movimiento:'Egreso',
    cantidad: '',
    categoria: '',
    comentario: '',
  });

  const categoriasEgresos = [
    'Alimentos y bebidas',
    'Salud e higiene',
    'Transporte',
    'Diversión',
    'Hogar',
    'Pago de servicios',
    'Otros gastos'
  ];

  const  categoriasIngresos = [
    'Salario',
    'Regalo',
    'Venta',
    'Inversión',
    'Comisiones',
    'Otros ingresos'
  ];

  const movimientos = [
    'Ingreso',
    'Egreso',
  ];

  const handleInputChange = (name, value) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCreate = async () => {
    try {
      //* Recuperar los datos existentes
      const jsonValue = await AsyncStorage.getItem('@form_key');
      let existingData = jsonValue ? JSON.parse(jsonValue) : [];
  
      //* Verificar si existingData es un array, si no, asignarle un array vacío
      existingData = Array.isArray(existingData) ? existingData : [];
  
      //* Agregar los nuevos datos del formulario
      if (formValues) {
        existingData.push(formValues);

        //* Guardar los datos actualizados en AsyncStorage
        await AsyncStorage.setItem("@form_key", JSON.stringify(existingData));

        //* Mostrar alerta de confirmación
        Alert.alert(
          "Registro exitoso",
          "¡Tu registro se ha completado con éxito!",
          [{ text: "OK"}],
          { cancelable: false }
        );
      } else {
        console.warn('formValues es null o undefined. No se ha agregado ningún dato.');
      }
    } catch (e) {
      console.error(e);
    }
  };
  

  const handleLoad = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@form_key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      //* Capturar y manejar cualquier error que pueda ocurrir
      console.error(e);
    }
  };

  const printData = async () => {
    const data = await handleLoad();
    console.log(data);
  };
  
  printData();


  return (
    <View style={styles.containerForm}>
      {/*Categoria*/}
      <Text
        style={{
          fontFamily: "Poppins-Medium",
          fontSize: 20,
          paddingTop: 30,
        }}
      >
        Tipo de movimiento
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formValues.movimiento}
          onValueChange={(value) => handleInputChange("movimiento", value)}
        >
          {movimientos.map((movimiento) => (
            <Picker.Item
              key={movimiento}
              label={movimiento}
              value={movimiento}
              style={{ fontFamily: "Poppins-Bold" }}
            />
          ))}
        </Picker>
      </View>

      {/* Cantidad */}
      <Text
        style={{
          fontFamily: "Poppins-Medium",
          fontSize: 20,
          paddingTop: 30,
        }}
      >
        Cantidad
      </Text>
      <TextInput
        style={styles.inputAmount}
        placeholder="$0.00"
        value={formValues.cantidad}
        onChangeText={(value) => handleInputChange("cantidad", value)}
        keyboardType='number-pad'
      />

      {/*Categorias*/}
      <Text
        style={{
          fontFamily: "Poppins-Medium",
          fontSize: 20,
          paddingTop: 30,
        }}
      >
        Selecciona una categoria
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formValues.categoria}
          onValueChange={(value) => handleInputChange("categoria", value)}
        >
          {/* Mostrar las opciones en base al movimiento seleccionado */}
          <Picker.Item label="Selecciona una opción" value={null} />
          {formValues.movimiento == "Ingreso"
            ? categoriasIngresos.map((categoria) => (
                <Picker.Item
                  key={categoria}
                  label={categoria}
                  value={categoria}
                />
              ))
            : categoriasEgresos.map((categoria) => (
                <Picker.Item
                  key={categoria}
                  label={categoria}
                  value={categoria}
                />
              ))}
        </Picker>
      </View>

      {/* Comentario */}
      <Text
        style={{
          fontFamily: "Poppins-Medium",
          fontSize: 20,
          paddingTop: 30,
        }}
      >
        Agregar un comentario (opcional)
      </Text>
      <TextInput
        style={styles.inputComment}
        placeholder="Comentario"
        value={formValues.comentario}
        onChangeText={(value) => handleInputChange("comentario", value)}
      />

      {/* Boton de añadir */}
      <TouchableOpacity
        style={styles.buttonForm}
        onPress={handleCreate}
      >
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
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
  twoColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  //*Estilos de la lista de registros
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  //*titulo de lista de registro
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  //*monto del registro
  amountIncome: {
    fontSize: 25,
    color: "red",
    fontFamily: "Poppins-Medium",
  },
  amountExpense: {
    fontSize: 25,
    color: "green",
    fontFamily: "Poppins-Medium",
  },

  //*Estilos del formulario para añadir registros
  containerForm: {
    padding: 20,
  },
  inputAmount: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    fontFamily: "Poppins-Medium",
  },
  pickerContainer: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  inputComment: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    fontFamily: "Poppins-Medium",
  },
  buttonForm: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
    marginTop: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    paddingTop:5,
    paddingBottom:5,
    fontFamily: "Poppins-Bold",
  },
};
