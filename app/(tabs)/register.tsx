import React, { useState } from "react"; 
import {
    View, 
    Text, 
    TextInput,
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView,
} from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth"; 
import { useRouter } from "expo-router";

export default function RegisterScreen() { 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState(""); 
    const { register, loading, error } = useAuth(); 
    const router = useRouter();

    const handleRegister = async () => {
        const success = await register(email, password, displayName); 
        if (success) {
        Alert.alert("Éxito", "Usuario registrado correctamente", [
            {
            text: "OK",
            onPress: () => router.replace("/(tabs)/todos"),
            },
        ]);
        } else {
        Alert.alert("Error", error || "No se pudo registrar el usuario");
        }
    };

    const goToLogin = () => { 
        router.back();
    };

    return (
        <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.content}>
            <Text style={styles.title}>Crear Cuenta</Text>

            <TextInput 
                style={styles.input} 
                placeholder="Nombre completo" 
                value={displayName} 
                onChangeText={setDisplayName}
            />

            <TextInput 
                style={styles.input} 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                autoCapitalize="none" 
                autoCorrect={false}
            />

            <TextInput 
                style={styles.input}
                placeholder="Contraseña (mínimo 6 caracteres)" 
                value={password}
                onChangeText={setPassword} 
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                <ActivityIndicator color="#fff" />
                ) : (
                <Text style={styles.buttonText}>Crear Cuenta</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={goToLogin} style={styles.linkButton}>
                <Text style={styles.linkText}>
                ¿Ya tienes cuenta? <Text style={styles.linkTextBold}>Inicia sesión</Text>
                </Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollContent: { 
        flexGrow: 1,
        justifyContent: "center",
    },
    content: { 
        padding: 20,
    },
    title: { 
        fontSize: 32,
        fontWeight: "bold", 
        marginBottom: 30, 
        textAlign: "center", 
        color: "#333",
    },
    input: {
        backgroundColor: "#fff", 
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1, 
        borderColor: "#ddd",
    },
    button: {
        backgroundColor: "#34C759",
        padding: 15,
        borderRadius: 10, 
        alignItems: "center", 
        marginTop: 10,
    },
    buttonDisabled: { 
        backgroundColor: "#999",
    },
    buttonText: { 
        color: "#fff", 
        fontSize: 18,
        fontWeight: "bold",
    },
    linkButton: { 
        marginTop: 20,
        padding: 10,
    },
    linkText: { 
        color: "#666",
        textAlign: "center", 
        fontSize: 16,
    },
    linkTextBold: { 
        color: "#007AFF", 
        fontWeight: "bold",
    },
});
