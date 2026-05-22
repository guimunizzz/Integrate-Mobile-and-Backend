import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
    const navigation = useNavigation<NavigationProps>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Atividade Integracao SQL</Text>
                <Text style={styles.subtitle}>Selecione uma opcao para continuar</Text>

                <TouchableOpacity onPress={() => navigation.navigate('Produtos')} style={styles.button}>
                    <Text style={styles.buttonText}>Produtos</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Categorias')} style={styles.button}>
                    <Text style={styles.buttonText}>Categorias</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        justifyContent: "center",
        padding: 16
    },
    content: {
        width: '100%'
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 18
    },
    button: {
        backgroundColor: '#111827',
        width: '100%',
        height: 50,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#111827'
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#f9fafb',
        fontWeight: '600'
    }
})