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

export default function LoginScreen() { 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const { login, loading, error } = useAuth(); 
    const router = useRouter();

    const handleLogin = async () => {
        const success = await login(email, password); 
        if (success) {
        router.replace("/(tabs)/todos");
        } else {
        Alert.alert("Error", error || "No se pudo iniciar sesión");
        }
    };

    const goToRegister = () => { 
        router.push("/(tabs)/register");
    };

    const goToForgot = () => {
        router.push("/(tabs)/forgot-password");
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
            <Text style={styles.title}>📝 TodoApp</Text>
            <Text style={styles.subtitle}>Iniciar Sesión</Text>

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
                placeholder="Contraseña" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                <ActivityIndicator color="#fff" />
                ) : (
                <Text style={styles.buttonText}>Entrar</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={goToRegister} style={styles.linkButton}>
                <Text style={styles.linkText}>
                ¿No tienes cuenta? <Text style={styles.linkTextBold}>Regístrate</Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToForgot} style={styles.linkButton}>
                <Text style={[styles.linkText, { marginTop: 8 }]}>¿Olvidaste tu contraseña?</Text>
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
        fontSize: 48,
        fontWeight: "bold", 
        marginBottom: 10, 
        textAlign: "center",
    },
    subtitle: { 
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 40, 
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
        backgroundColor: "#007AFF", 
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
