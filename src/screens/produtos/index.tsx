import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, FlatList, View, TextInput, Modal } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

export type Produto = {
    id: number,
    nomeProduto: string,
    valorAVista: number
}

type Quantidades = {
    [key: string]: number
}

const categorias = [
    { label: 'Teclado', value: '1' },
    { label: 'Mouse', value: '2' },
];

export default function Produtos() {

    const produtos: Produto[] = [
        { id: 1, nomeProduto: 'Teclado Logitech', valorAVista: 100 },
        { id: 2, nomeProduto: 'Mouse Superlight', valorAVista: 100 }
    ]

    const [quantidade, setQuantidades] = useState<Quantidades>({});
    const [busca, setBusca] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [nomeProduto, setNomeProduto] = useState('');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState(null);

    const produtosFiltrados = produtos.filter(produto =>
        produto.nomeProduto.toLowerCase().startsWith(busca.toLowerCase())
    );

    const diminuir = (id: number) => {
        setQuantidades(valor => ({
            ...valor,
            [id]: valor[id] > 1 ? valor[id] - 1 : 1
        }))
    }

    const aumentar = (id: number) => {
        setQuantidades(valor => ({
            ...valor,
            [id]: (valor[id] || 1) + 1
        }))
    }

    const handleSalvarProduto = () => {
        if (nomeProduto.trim() && valor.trim() && categoria) {
            setNomeProduto('');
            setValor('');
            setCategoria(null);
            setModalVisible(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput placeholder='Digite para pesquisar'
                    style={styles.textBusca}
                    value={busca}
                    onChangeText={setBusca}
                    placeholderTextColor="#9ca3af"
                />
            </View>
            <View style={styles.headerAction}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
                    <Text style={styles.buttonText}>Novo +</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={produtosFiltrados}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.nomeProduto}>{item.nomeProduto}</Text>
                        <View style={styles.precosContainer}>
                            <Text style={styles.label}>Categoria:</Text>
                            <Text style={styles.valueText}>Sem categoria</Text>
                        </View>

                        <View style={styles.precosContainer}>
                            <Text style={styles.label}>Valor a vista:</Text>
                            <Text style={styles.precoAVista}>
                                R$ {item.valorAVista.toFixed(2).replace('.', ',')}</Text>
                        </View>

                        <View style={styles.acoesContainer}>
                            <View style={styles.qtdContainer}>
                                <TouchableOpacity onPress={() => diminuir(item.id)} style={styles.btnQtd}>
                                    <Text>-</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.quantidade}>
                                {quantidade[item.id] || 1}
                            </Text>

                            <View style={styles.qtdContainer}>
                                <TouchableOpacity onPress={() => aumentar(item.id)} style={styles.btnQtd}>
                                    <Text>+</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.buttonAddCarrinho}>
                                <Text style={styles.textAddCarrinho}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Novo Produto</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.field}
                            placeholder="Inserir nome do produto"
                            placeholderTextColor="#6b7280"
                            onChangeText={setNomeProduto}
                            value={nomeProduto}
                        />
                        <TextInput
                            style={styles.field}
                            placeholder="Inserir valor"
                            placeholderTextColor="#6b7280"
                            onChangeText={setValor}
                            value={valor}
                        />
                        <Dropdown
                            style={styles.field}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedTextStyle={styles.dropdownSelectedText}
                            inputSearchStyle={styles.dropdownSearchInput}
                            data={categorias}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Selecione uma categoria"
                            searchPlaceholder="Buscar..."
                            value={categoria}
                            onChange={item => {
                                setCategoria(item.value);
                            }}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.buttonCancel}
                                onPress={() => {
                                    setNomeProduto('');
                                    setValor('');
                                    setCategoria(null);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.textButtonCancel}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonSave}
                                onPress={handleSalvarProduto}
                            >
                                <Text style={styles.textButtonSave}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingTop: 10
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 10
    },
    headerAction: {
        paddingHorizontal: 16,
        alignItems: 'flex-end',
        marginBottom: 10
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24
    },
    button: {
        backgroundColor: '#111827',
        minWidth: 110,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 14
    },
    buttonText: {
        color: '#f9fafb',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600'
    },
    textBusca: {
        height: 46,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        color: '#111827'
    },
    imagem: {
        width: 100,
        height: 100,
        marginBottom: 10,
        resizeMode: 'contain'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb'
    },
    nomeProduto: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 8,
        color: '#111827'
    },
    precosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 6
    },
    label: {
        color: '#6b7280',
        fontSize: 14
    },
    valueText: {
        color: '#111827',
        fontSize: 14,
        fontWeight: '500'
    },
    precoParcelado: {
        color: '#777',
        fontSize: 14
    },
    precoAVista: {
        color: '#111827',
        fontSize: 15,
        fontWeight: '600'
    },
    acoesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-between',
        width: '100%'
    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnQtd: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8
    },
    quantidade: {
        marginHorizontal: 10,
        fontSize: 15,
        fontWeight: '600',
        color: '#111827'
    },
    buttonAddCarrinho: {
        backgroundColor: '#111827',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAddCarrinho: {
        color: '#f9fafb',
        fontWeight: '600'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 20,
        maxHeight: '80%'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827'
    },
    closeButton: {
        fontSize: 24,
        color: '#6b7280',
        fontWeight: '600'
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
        color: '#111827'
    },
    dropdownPlaceholder: {
        fontSize: 15,
        color: '#6b7280'
    },
    dropdownSelectedText: {
        fontSize: 15,
        color: '#111827'
    },
    dropdownSearchInput: {
        height: 40,
        fontSize: 15,
        color: '#111827'
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
        marginBottom: 10
    },
    buttonCancel: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    textButtonCancel: {
        color: '#111827',
        fontWeight: '600'
    },
    buttonSave: {
        flex: 1,
        backgroundColor: '#111827',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    textButtonSave: {
        color: '#f9fafb',
        fontWeight: '600'
    }
})