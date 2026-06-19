import React, { useCallback, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet,
    Modal, TextInput, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import api from '../../api/api';

type Produto = {
    id_produto: number;
    nome: string;
    valorProduto: string;
    id_categoriaFK: number;
};

type Categoria = {
    id_categoria: number;
    descricao: string;
};

export default function Produtos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [busca, setBusca] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);

    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [idCategoria, setIdCategoria] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            void loadData();
        }, [])
    );

    async function loadData() {
        try {
            const [produtosRes, categoriasRes] = await Promise.all([
                api.get('/produtos'),
                api.get('/categorias'),
            ]);
            setProdutos(produtosRes.data.produtos);
            setCategorias(categoriasRes.data.categorias);
        } catch (error: any) {
            console.error('Erro ao carregar dados:', error?.response?.status, error?.response?.data);
        }
    }

    async function salvar() {
        if (!nome.trim() || !valor.trim() || !idCategoria) {
            Alert.alert('Atenção', 'Preencha nome, valor e categoria.');
            return;
        }
        try {
            const body = {
                nome,
                valor: Number.parseFloat(valor.replace(',', '.')),
                idCategoria: Number(idCategoria),
            };
            if (selectedProduto) {
                await api.put('/produtos', body, { params: { id: selectedProduto.id_produto } });
            } else {
                await api.post('/produtos', body);
            }
            closeModal();
            await loadData();
        } catch (error: any) {
            console.error('Erro ao salvar produto:', error?.response?.status, error?.response?.data);
            Alert.alert('Erro', `Não foi possível salvar: ${error?.response?.status} - ${JSON.stringify(error?.response?.data)}`);
        }
    }

    function confirmarExclusao(item: Produto) {
        Alert.alert(
            'Excluir produto',
            `Deseja excluir "${item.nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete('/produtos', { params: { id: item.id_produto } });
                            await loadData();
                        } catch (error: any) {
                            console.error('Erro ao excluir produto:', error?.response?.status, error?.response?.data);
                            Alert.alert('Erro', `Não foi possível excluir: ${error?.response?.status} - ${JSON.stringify(error?.response?.data)}`);
                        }
                    },
                },
            ]
        );
    }

    function openEdit(item: Produto) {
        setSelectedProduto(item);
        setNome(item.nome);
        setValor(item.valorProduto);
        setIdCategoria(String(item.id_categoriaFK));
        setModalVisible(true);
    }

    function openCreate() {
        setSelectedProduto(null);
        setNome('');
        setValor('');
        setIdCategoria(null);
        setModalVisible(true);
    }

    function closeModal() {
        setSelectedProduto(null);
        setNome('');
        setValor('');
        setIdCategoria(null);
        setModalVisible(false);
    }

    const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().startsWith(busca.toLowerCase())
    );

    const categoriasDropdown = categorias.map(c => ({
        label: c.descricao,
        value: String(c.id_categoria),
    }));

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Digite para pesquisar"
                    style={styles.textBusca}
                    value={busca}
                    onChangeText={setBusca}
                    placeholderTextColor="#9ca3af"
                />
            </View>
            <View style={styles.headerAction}>
                <TouchableOpacity onPress={openCreate} style={styles.button}>
                    <Text style={styles.buttonText}>Novo +</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={produtosFiltrados}
                keyExtractor={(item) => String(item.id_produto)}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.nomeProduto}>{item.nome}</Text>
                        <View style={styles.precosContainer}>
                            <Text style={styles.label}>Categoria:</Text>
                            <Text style={styles.valueText}>
                                {categorias.find(c => c.id_categoria === item.id_categoriaFK)?.descricao ?? '-'}
                            </Text>
                        </View>
                        <View style={styles.precosContainer}>
                            <Text style={styles.label}>Valor:</Text>
                            <Text style={styles.precoAVista}>
                                R$ {Number.parseFloat(item.valorProduto).toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                        <View style={styles.acoesContainer}>
                            <TouchableOpacity style={styles.buttonEdit} onPress={() => openEdit(item)}>
                                <Text style={styles.buttonEditText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonDelete} onPress={() => confirmarExclusao(item)}>
                                <Text style={styles.buttonDeleteText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {modalVisible && (
                <Modal visible transparent animationType="slide" onRequestClose={closeModal}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {selectedProduto ? 'Editar Produto' : 'Novo Produto'}
                                </Text>
                                <TouchableOpacity onPress={closeModal}>
                                    <Text style={styles.closeButton}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.field}
                                placeholder="Nome do produto"
                                placeholderTextColor="#6b7280"
                                value={nome}
                                onChangeText={setNome}
                            />
                            <TextInput
                                style={styles.field}
                                placeholder="Valor (ex: 29.90)"
                                placeholderTextColor="#6b7280"
                                value={valor}
                                onChangeText={setValor}
                                keyboardType="decimal-pad"
                            />
                            <Dropdown
                                style={styles.field}
                                placeholderStyle={styles.dropdownPlaceholder}
                                selectedTextStyle={styles.dropdownSelectedText}
                                inputSearchStyle={styles.dropdownSearchInput}
                                data={categoriasDropdown}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Selecione uma categoria"
                                searchPlaceholder="Buscar..."
                                value={idCategoria}
                                onChange={item => setIdCategoria(item.value)}
                            />

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.buttonCancel} onPress={closeModal}>
                                    <Text style={styles.textButtonCancel}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonSave} onPress={salvar}>
                                    <Text style={styles.textButtonSave}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingTop: 10,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    headerAction: {
        paddingHorizontal: 16,
        alignItems: 'flex-end',
        marginBottom: 10,
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
    textBusca: {
        height: 46,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        color: '#111827',
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
    precosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
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
    precoAVista: {
        color: '#111827',
        fontSize: 15,
        fontWeight: '600',
    },
    acoesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'flex-end',
        marginTop: 10,
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
        color: '#dc2626',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    closeButton: {
        fontSize: 24,
        color: '#6b7280',
        fontWeight: '600',
    },
    field: {
        height: 52,
        width: '100%',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 12,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        color: '#111827',
    },
    dropdownPlaceholder: {
        fontSize: 15,
        color: '#6b7280',
    },
    dropdownSelectedText: {
        fontSize: 15,
        color: '#111827',
    },
    dropdownSearchInput: {
        height: 40,
        fontSize: 15,
        color: '#111827',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    buttonCancel: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    textButtonCancel: {
        color: '#111827',
        fontWeight: '600',
    },
    buttonSave: {
        flex: 1,
        backgroundColor: '#111827',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    textButtonSave: {
        color: '#f9fafb',
        fontWeight: '600',
    },
});
