import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { initDB } from '../../database/database';
import { CategoriaRepository } from '../../repositories/CategoriaRepository';
import { Categoria } from '../../models/CategoriaModel';

export default function CategoriaScreen() {

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);

    const categoriaRepo = new CategoriaRepository();

    useEffect(() => {
        const setup = async () => {
            await initDB();
            loadData();
        }
        setup();
    }, [])

    async function loadData(): Promise<void> {
        const data = await categoriaRepo.findAll();
        setCategorias(data);
        setModalVisible(false);
    }

    async function salvar() {
        if (!nomeCategoria.trim()) return;
        if (selectedCategoria) {
            await categoriaRepo.update(new Categoria(nomeCategoria, selectedCategoria.Id));
        } else {
            await categoriaRepo.create(new Categoria(nomeCategoria, 0));
        }
        closeModal();
        await loadData();
    }

    function confirmarExclusao(item: Categoria): void {
        Alert.alert(
            'Excluir categoria',
            `Deseja excluir a categoria "${item.Nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        await categoriaRepo.delete(item.Id);
                        await loadData();
                    },
                },
            ],
        );
    }

    function openCreate(): void {
        setSelectedCategoria(null);
        setNomeCategoria('');
        setModalVisible(true);
    }
    function openEdit(item:Categoria): void {
        setSelectedCategoria(item);
        setNomeCategoria(item.Nome);
        setModalVisible(true);
    }
    function closeModal(): void {
        setSelectedCategoria(null);
        setNomeCategoria('');
        setModalVisible(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titleScreen}>Gestão de categorias</Text>
                <TouchableOpacity style={styles.button} onPress={openCreate}>
                    <Text style={styles.buttonText}>Novo +</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={categorias}
                keyExtractor={(item) => String(item.Id)}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.nomeProduto}>{item.Nome}</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>ID:</Text>
                            <Text style={styles.valueText}>{item.Id}</Text>
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

            <Modal
                visible={modalVisible}
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
            </Modal>
        </SafeAreaView>
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
