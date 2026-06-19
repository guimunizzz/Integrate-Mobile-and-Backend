import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/home";
import Produtos from "./src/screens/produtos";
import CategoriaScreen from "./src/screens/categorias";
import NovaCategoriaScreen from "./src/screens/novaCategoria";

export type RootStackParamList = {
  Home: undefined,
  Produtos: undefined,
  Categorias: undefined,
  NovaCategoria: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name='Home'
          component={Home}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name='Produtos'
          component={Produtos}
        />
        <Stack.Screen
          name='Categorias'
          component={CategoriaScreen}
        />
        <Stack.Screen
          name='NovaCategoria'
          component={NovaCategoriaScreen}
          options={{ title: 'Nova Categoria' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

