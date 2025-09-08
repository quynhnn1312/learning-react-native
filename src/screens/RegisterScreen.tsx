import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useMutation } from '@tanstack/react-query';

interface UserData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  phoneNumber?: string;
  general?: string;
}

interface NavigationProps {
  navigation: {
    navigate: (screen: string) => void;
    replace: (screen: string) => void;
  };
}

const fakeRegister = async (userData: UserData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (userData.username.length < 3) {
    throw new Error('Username must be at least 3 characters');
  }
  if (userData.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  if (userData.password !== userData.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  if (!userData.email.includes('@')) {
    throw new Error('Please enter a valid email');
  }
  return { success: true, message: 'Account created successfully!' };
};

export default function RegisterScreen({ navigation }: NavigationProps) {
  const [formData, setFormData] = useState<UserData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const mutation = useMutation({
    mutationFn: fakeRegister,
    onSuccess: (data) => {
      Alert.alert('Success', data.message, [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    },
    onError: (error: Error) => {
      setErrors({ general: error.message });
    }
  });

  const validateField = (field: keyof UserData, value: string) => {
    const newErrors: ValidationErrors = { ...errors };
    
    switch (field) {
      case 'username':
        if (value.length < 3) {
          newErrors.username = 'Username must be at least 3 characters';
        } else {
          delete newErrors.username;
        }
        break;
      case 'email':
        if (!value.includes('@')) {
          newErrors.email = 'Please enter a valid email';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case 'fullName':
        if (value.trim().length < 2) {
          newErrors.fullName = 'Full name must be at least 2 characters';
        } else {
          delete newErrors.fullName;
        }
        break;
      case 'phoneNumber':
        if (value.length > 0 && value.length < 10) {
          newErrors.phoneNumber = 'Please enter a valid phone number';
        } else {
          delete newErrors.phoneNumber;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const updateFormData = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleRegister = () => {
    // Validate all fields before submitting
    (Object.keys(formData) as Array<keyof UserData>).forEach(field => {
      validateField(field, formData[field]);
    });

    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors && formData.username && formData.email && formData.password && formData.fullName) {
      mutation.mutate(formData);
    } else {
      setErrors((prev: ValidationErrors) => ({ ...prev, general: 'Please fill in all required fields correctly' }));
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create Account</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          placeholder="Enter your full name"
          value={formData.fullName}
          onChangeText={(value) => updateFormData('fullName', value)}
          style={[styles.input, errors.fullName && styles.inputError]}
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username *</Text>
        <TextInput
          placeholder="Choose a username"
          value={formData.username}
          onChangeText={(value) => updateFormData('username', value)}
          style={[styles.input, errors.username && styles.inputError]}
          autoCapitalize="none"
        />
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(value) => updateFormData('email', value)}
          style={[styles.input, errors.email && styles.inputError]}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="Enter your phone number (optional)"
          value={formData.phoneNumber}
          onChangeText={(value) => updateFormData('phoneNumber', value)}
          style={[styles.input, errors.phoneNumber && styles.inputError]}
          keyboardType="phone-pad"
        />
        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          placeholder="Create a password (min 6 characters)"
          value={formData.password}
          onChangeText={(value) => updateFormData('password', value)}
          style={[styles.input, errors.password && styles.inputError]}
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChangeText={(value) => updateFormData('confirmPassword', value)}
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      </View>

      {errors.general && <Text style={styles.generalError}>{errors.general}</Text>}

      <View style={styles.buttonContainer}>
        <Button 
          title={mutation.isPending ? "Creating Account..." : "Create Account"} 
          onPress={handleRegister}
          disabled={mutation.isPending}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Already have an account? Login" 
          onPress={() => navigation.navigate('Login')}
          color="#666"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 5,
  },
  generalError: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
  },
  buttonContainer: {
    marginBottom: 15,
  },
});
