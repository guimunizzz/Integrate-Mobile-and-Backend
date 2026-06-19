import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import api from '../../api/api';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'NovaCategoria'>;

export default function NovaCategoriaScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [descricao, setDescricao] = useState('');

    async function salvar() {
        if (!descricao.trim()) return;
        await api.post('/categorias', { descricao });
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Nova Categoria</Text>

            <TextInput
                placeholder="Digite o nome da categoria"
                placeholderTextColor="#6b7280"
                value={descricao}
                onChangeText={setDescricao}
                style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={salvar}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 24,
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        color: '#111827',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#111827',
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#f9fafb',
        fontSize: 16,
        fontWeight: '600',
    },
});
