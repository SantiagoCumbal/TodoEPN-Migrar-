import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createStyles, defaultLightTheme, defaultDarkTheme } from '@/src/presentation/styles/todos.styles';

export default function ProfileScreen() {
  const { user, updateProfile, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.displayName || '');
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? defaultDarkTheme : defaultLightTheme;
  const themeStyles = createStyles(theme);

  const handleSave = async () => {
    if (!user) return;
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    const ok = await updateProfile(user.id, name.trim());
    if (ok) {
      Alert.alert('Éxito', 'Perfil actualizado');
      router.replace('/(tabs)/todos');
    } else {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  return (
    <View style={themeStyles.container}>
      <View style={[themeStyles.header, { marginBottom: 16 }]}> 
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingVertical: 6, paddingHorizontal: 8, marginRight: 8 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>← Volver</Text>
        </TouchableOpacity>
        <Text
          style={[
            themeStyles.title,
            {
              position: 'absolute',
              left: 0,
              right: 0,
              textAlign: 'center',
              color: '#fff',
              textShadowColor: 'rgba(0,0,0,0.35)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            },
          ]}
        >
          Perfil
        </Text>
      </View>
      <View style={{ width: '100%' }}>
        <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4, alignSelf: 'flex-start' }}>Email</Text>
        <Text style={{ fontSize: 16, color: theme.text, marginBottom: 12, alignSelf: 'flex-start' }}>{user?.email}</Text>

        <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4, alignSelf: 'flex-start' }}>Nombre</Text>
        {/* Plain input without themed styles to ensure black text on all themes */}
        <TextInput
          style={{
            alignSelf: 'stretch',
            backgroundColor: '#fff',
            color: '#000',
            borderWidth: 1,
            borderColor: '#e6e6e6',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 8,
            fontSize: 16,
          }}
          value={name}
          onChangeText={setName}
          placeholder="Ingresa tu nombre"
          placeholderTextColor={theme.textSecondary}
          selectionColor="#000"
          underlineColorAndroid="transparent"
          keyboardAppearance="light"
        />

  {/* debug removed */}

        <View style={{ marginTop: 20, width: '100%', alignItems: 'flex-start' }}>
          <TouchableOpacity
            style={{ backgroundColor: theme.primary, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8, minWidth: 140, alignItems: 'center' }}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={{ color: theme.primaryText, fontWeight: '700' }}>{loading ? 'Guardando...' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// local styles were replaced by themed styles from todos.styles.ts
