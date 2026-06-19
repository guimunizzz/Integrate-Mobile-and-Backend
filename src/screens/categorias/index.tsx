import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import api from '../../api/api';

export default function CategoriaScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Categorias'>>();

    const [categorias, setCategorias] = useState<{ descricao: string; id_categoria: number }[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState<{ descricao: string; id_categoria: number } | null>(null);

    useFocusEffect(
        useCallback(() => {
            void loadData();
        }, [])
    );

    async function loadData(): Promise<void> {
        try {
            const response = await api.get('/categorias');
            setCategorias(response.data.categorias);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    }

    async function salvar() {
        if (!nomeCategoria.trim()) return;
        try {
            if (selectedCategoria) {
                await api.put('/categorias', { descricao: nomeCategoria }, { params: { id: selectedCategoria.id_categoria } });
            } else {
                await api.post('/categorias', { descricao: nomeCategoria });
            }
            closeModal();
            await loadData();
        } catch (error: any) {
            console.error('Erro ao salvar categoria:', error?.response?.status, error?.response?.data);
            Alert.alert('Erro', `Não foi possível salvar: ${error?.response?.status} - ${JSON.stringify(error?.response?.data)}`);
        }
    }

    function confirmarExclusao(item: { descricao: string; id_categoria: number }): void {
        Alert.alert(
            'Excluir categoria',
            `Deseja excluir a categoria "${item.descricao}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete('/categorias', { params: { id: item.id_categoria } });
                            await loadData();
                        } catch (error: any) {
                            console.error('Erro ao excluir categoria:', error?.response?.status, error?.response?.data);
                            Alert.alert('Erro', `Não foi possível excluir: ${error?.response?.status} - ${JSON.stringify(error?.response?.data)}`);
                        }
                    },
                },
            ],
        );
    }

    function openEdit(item: { descricao: string; id_categoria: number }): void {
        setSelectedCategoria(item);
        setNomeCategoria(item.descricao);
        setModalVisible(true);
    }
    function closeModal(): void {
        setSelectedCategoria(null);
        setNomeCategoria('');
        setModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titleScreen}>Gestão de categorias</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NovaCategoria')}>
                    <Text style={styles.buttonText}>Novo +</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={categorias}
                keyExtractor={(item) => String(item.id_categoria)}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.nomeProduto}>{item.descricao}</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>ID:</Text>
                            <Text style={styles.valueText}>{item.id_categoria}</Text>
                        </View>

                        <View style={styles.acoesContainer}>
                            <TouchableOpacity
                                style={styles.buttonEdit}
                                onPress={() => openEdit(item)}
                            >
                                <Text style={styles.buttonEditText}>Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.buttonDelete}
                                onPress={() => confirmarExclusao(item)}
                            >
                                <Text style={styles.buttonDeleteText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {modalVisible && <Modal
                visible
                transparent
                animationType="slide"
                onRequestClose={() => closeModal()}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            {selectedCategoria ? 'Editar Categoria' : 'Nova Categoria'}
                        </Text>

                        <TextInput
                            placeholder="Digite o nome da categoria"
                            placeholderTextColor="#6b7280"
                            value={nomeCategoria}
                            onChangeText={setNomeCategoria}
                            style={styles.input}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => closeModal()}
                            >
                                <Text style={{ color: '#111827', fontWeight: '600' }}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={salvar}
                            >
                                <Text style={{ color: '#f9fafb', fontWeight: '600' }}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    titleScreen: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    button: {
        backgroundColor: '#111827',
        minWidth: 110,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 14,
    },
    buttonText: {
        color: '#f9fafb',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    nomeProduto: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 8,
        color: '#111827',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 6,
    },
    label: {
        color: '#6b7280',
        fontSize: 14,
    },
    valueText: {
        color: '#111827',
        fontSize: 14,
        fontWeight: '500',
    },
    acoesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'flex-end',
    },
    buttonEdit: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonEditText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    buttonDelete: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonDeleteText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
    },
    input: {
        height: 52,
        width: '100%',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        color: '#111827',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    saveButton: {
        backgroundColor: '#111827',
    },
});
