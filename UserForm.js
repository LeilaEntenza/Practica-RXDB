import {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

const userForm = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const db = useSQLiteContext();
    const handleSubmit = async () => {
        try{
            if (!form.firstName || !form.lastName || !form.email || !form.phone) {
                throw new Error('All fields are required');
            }
            await db.runAsync(
                'INSERT INTO users (firstName, lastName, email, phone) VALUES (?, ?, ?, ?)',
                [form.firstName, form.lastName, form.email, form.phone]
            );

            Alert.alert('Success', 'User added successfully');
            setForm({ firstName: '', lastName: '', email: '', phone: '' });
    }
    catch (error) {
        console.error(error);
        Alert.alert('Error', error.message || 'An error occurred while adding the user');

    }
};
    return (
        <View style={styles.container}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
                style={styles.input}
                value={form.firstName}
                onChangeText={(text) => setForm({ ...form, firstName: text })}
            />
            <Text style={styles.label}>Last Name</Text>
            <TextInput
                style={styles.input}
                value={form.lastName}
                onChangeText={(text) => setForm({ ...form, lastName: text })}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput 
                style={styles.input}
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(text) => setForm({ ...form, phone: text })}
                keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Add User</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {    
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default userForm;