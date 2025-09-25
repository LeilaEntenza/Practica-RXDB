import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import db from './db';

export default function App() {
  const [texto, setTexto] = useState('');
  const [items, setItems] = useState([]);

  // Cargar datos cuando arranca la app
  useEffect(() => {
    cargarDatos();

    // Suscripción para cambios en tiempo real
    const changes = db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', cargarDatos);

    return () => changes.cancel(); // Limpiar cuando se desmonta
  }, []);

  // Agregar item a la DB
  const agregarItem = async () => {
    if (!texto) return;
    await db.post({ texto });
    setTexto('');
  };

  // Obtener datos
  const cargarDatos = async () => {
    const result = await db.allDocs({ include_docs: true });
    setItems(result.rows.map(row => row.doc));
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Escribe algo..."
        value={texto}
        onChangeText={setTexto}
        style={styles.input}
      />
      <Button title="Agregar" onPress={agregarItem} />
      <FlatList
        data={items}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <Text style={styles.item}>{item.texto}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  item: { padding: 10, fontSize: 16, borderBottomWidth: 1 }
});
