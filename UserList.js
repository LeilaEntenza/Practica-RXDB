import { useState, useEffect, use } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const db = useSQLiteContext();

    const loadUsers = async () => {
        try{
            const results = await db.getAllAsync('SELECT * FROM users');
            setUsers(results);
        }
        catch (error) {
            console.error("Database error", error);
        }
        finally {
            setIsLoading(false);
        }
};

useEffect(() => {
    loadUsers();
}, []);

if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />; 
}

return (
    <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <View style={styles.userItem}>
                <Text>{`${item.firstName} ${item.lastName}`}</Text>
                <Text>{item.email}</Text>
                <Text>{item.phone}</Text>
            </View>
        )}
        ListEmptyComponent={<Text>No users found</Text>}
    />
);
};

const styles = StyleSheet.create({
    userItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default UserList;