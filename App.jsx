// You can import Ionicons from @expo/vector-icons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import * as React from 'react';
import { Text, View, ScrollView,TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useIsFocused, useNavigation } from '@react-navigation/native';
import { Card, Icon } from '@rneui/themed';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';


//*Componente de la pantalla principal
function HomeScreen({ navigation }) {

  const isFocused = useIsFocused();

  //*Uses states
  const [dataCard, setDataCard] = useState([]);
  const [balance, setBalance] = useState(0);
  const [incomes, setIncomes] = useState(0);
  const [expensives, setExpensives] = useState(0);

  //*Obtener todos los registros del almacenamiento local
  const handleLoad = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@form_key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      //* Capturar y manejar cualquier error que pueda ocurrir
      console.error(e);
    }
  };

  //*eliminar todos los registros
  const handleClear = async () => {
    try {
      await AsyncStorage.removeItem("@form_key");
      console.log("¡Los datos se han eliminado con éxito!");
    } catch (e) {
      console.error(e);
    }
  };

  //*Obtener los registros cuando se seleccionala pantalla home
  useEffect(() => {
    if (isFocused) {
      //*Logica de carga de la pantalla
      const getData = async () => {
        const data = await handleLoad();

        if (data) {
          //*Calcular el balance tota, ingresos y egresos
          let balance = 0;
          let incomes = 0;
          let expensives = 0;
          data.forEach(item => {
            const cantidad = Number(item.cantidad);
            if (item.movimiento === 'Ingreso') {
              balance += cantidad;
              incomes += cantidad;
            } else if (item.movimiento === 'Egreso') {
              balance -= cantidad;
              expensives += cantidad;
            }
          });
          //*Asignar valores
          setBalance(balance);
          setIncomes(incomes);
          setExpensives(expensives);
          setDataCard(data);
        }

      };
      //*Ejecutar la funcion de carga de valores
      getData();
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Cashy"
    });
  }, [navigation]);


  return (
    <View style={styles.textContent}>
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
          ${balance}
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
            width: "40%",
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
            ${incomes}
          </Text>
        </Card>
        {/* Card de total de egresos */}
        <Card
          containerStyle={{
            borderColor: "red",
            borderWidth: 2,
            borderRadius: 8,
            width: "40%",
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
            ${expensives}
          </Text>
        </Card>
      </View>

      {/* Registros*/}
      {dataCard.length > 0 ? (
        <>
        {/* Ultimos registros*/}
          <Text
            style={{
              paddingTop: 20,
              paddingLeft: 20,
              fontSize: 20,
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
            {/*Carta de ingresos*/}
            {dataCard &&
              dataCard.map((item, index) => (
                <Card
                  containerStyle={{
                    borderRadius: 10,
                  }}
                  key={index}
                >
                  <View style={styles.cardContent}>
                    <Icon
                      name={
                        item.movimiento == "Ingreso"
                          ? "cash-plus"
                          : "cash-minus"
                      }
                      type="material-community"
                      size={40}
                      color={item.movimiento == "Ingreso" ? "green" : "red"}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>{item.categoria}</Text>
                      <Text style={{ fontFamily: "Poppins-Medium" }}>
                        {item.comentario}
                      </Text>
                    </View>
                    <View style={styles.amountContainer}>
                      <Text
                        style={
                          item.movimiento == "Ingreso"
                            ? styles.amountExpense
                            : styles.amountIncome
                        }
                      >
                        {item.movimiento == "Ingreso" ? "+" : "-"}$
                        {item.cantidad}
                      </Text>

                      <Text style={{ fontFamily: "Poppins-Medium" }}>
                        {new Date(item.fecha + "T00:00:00").toLocaleDateString(
                          "es-MX",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
          </ScrollView>
        </>
      ) : (
        <>
        {/*Sin registros...*/}
          <Text
            style={{
              paddingTop: 20,
              paddingLeft: 20,
              fontSize: 30,
              fontFamily: "Poppins-Bold",
            }}
          >
            Sin registros...
          </Text>
        </>
      )}
    </View>
  );
}

//*Componente del formulario para añadir gastos e ingresos
function AddScreen() {

  let defaultValues = {
    movimiento:'Egreso',
    cantidad: '',
    categoria: '',
    comentario: '',
    fecha:'',
  }

  const [formValues, setFormValues] = useState(defaultValues);

  const navigation = useNavigation();

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

        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        formValues.fecha = date;

        existingData.push(formValues);

        //* Guardar los datos actualizados en AsyncStorage
        await AsyncStorage.setItem("@form_key", JSON.stringify(existingData));

        //* Mostrar alerta de confirmación
        Alert.alert(
          "Registro exitoso",
          "¡Tu registro se ha completado con éxito!",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate('Inicio');
                setFormValues(defaultValues);

              }
            }
          ],
          { cancelable: false }
        );
      } else {
        console.warn('formValues es null o undefined. No se ha agregado ningún dato.');
      }
    } catch (e) {
      console.error(e);
    }
  };
  

  return (
    <View style={styles.containerForm}>
      <ScrollView>
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
          keyboardType="number-pad"
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
        <TouchableOpacity style={styles.buttonForm} onPress={handleCreate}>
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {

  //*Cargar fuentes externas
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
  });

  //*Logica para asegurarse que las fuentes esten cargadas
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

              if (route.name === "Inicio") {
                iconName = "home";
              } else if (route.name === "Agregar") {
                iconName = "add-circle-sharp";
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            //Configuracion de colores
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: "gray",
          })}
        >
          {/*Elementos visualez*/}
          <Tab.Screen name="Inicio" component={HomeScreen}  />
          <Tab.Screen name="Agregar" component={AddScreen} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}

//*Estilos
const styles = {
  //*Estilos generales
  textContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  twoColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  //*Lista de registros
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
  //?titulo de lista de registro
  title: {
    fontSize: 15,
    fontFamily: "Poppins-Bold",
  },
  //?monto del registro de ingreso
  amountIncome: {
    fontSize: 25,
    color: "red",
    fontFamily: "Poppins-Medium",
  },
  //?monto del registro de egreso
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
