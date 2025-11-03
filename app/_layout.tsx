import { DarkTheme, DefaultTheme, ThemeProvider,} from "@react-navigation/native"; 
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router"; 
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native"; import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme"; import { container } from "@/src/di/container";
import { useAuth } from "@/src/presentation/hooks/useAuth"; // ← NUEVO
SplashScreen.preventAutoHideAsync(); export default function RootLayout() {
const colorScheme = useColorScheme(); const [loaded] = useFonts({
SpaceMono: require("@/assets/fonts/SpaceMono-BoldItalic.ttf"),
});

const [containerReady, setContainerReady] = useState(false); const { user, loading: authLoading } = useAuth(); // ← NUEVO 
const segments = useSegments(); // ← NUEVO

const router = useRouter(); // ← NUEVO

useEffect(() => {
const initContainer = async () => { try {
await container.initialize(); setContainerReady(true);
} catch (error) {
console.error("Error initializing container:", error);
}
};

initContainer();
}, []);

// ← NUEVO: Protección de rutas
useEffect(() => {
if (!containerReady || authLoading) return;

// Consider forgot-password as part of auth group so unauthenticated users can access it
const inAuthGroup =
  segments[0] === "(tabs)" &&
  (segments[1] === "login" || segments[1] === "register" || segments[1] === "forgot-password");

if (!user && !inAuthGroup) {
// Usuario no autenticado intenta acceder a ruta protegida 
  router.replace("/(tabs)/login");
} else if (user && inAuthGroup) {
// Usuario autenticado intenta acceder a login/register 
  router.replace("/(tabs)/todos");
}
}, [user, segments, containerReady, authLoading, router]);


useEffect(() => {
if (loaded && containerReady && !authLoading) { SplashScreen.hideAsync();
}
}, [loaded, containerReady, authLoading]);

if (!loaded || !containerReady || authLoading) { return (
<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
<ActivityIndicator size="large" />
</View>
);
}

return (
<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
<Stack screenOptions={{ headerShown: false }}>
<Stack.Screen name="(tabs)/login" />
<Stack.Screen name="(tabs)/register" />
<Stack.Screen name="(tabs)/todos" />
 
</Stack>
</ThemeProvider>
);
}
