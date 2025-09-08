import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useMutation } from '@tanstack/react-query';

const fakeLogin = async ({ username, password }: { username: string; password: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (username === 'admin' && password === '1234') return { token: 'fake-token' };
  throw new Error('Invalid credentials');
};

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const mutation = useMutation({
    mutationFn: fakeLogin,
    onSuccess: () => navigation.replace('Home'),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={() => mutation.mutate({ username, password })} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
      </View>
      {mutation.isError && <Text style={styles.error}>{mutation.error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
  buttonContainer: { marginBottom: 12 },
  error: { color: 'red', marginTop: 8 },
});
