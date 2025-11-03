import { StyleSheet } from "react-native";
 
export interface TodosTheme {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryText: string;
  border: string;
  placeholder: string;
}
 
/**
* Factory de estilos que recibe el tema como parametro
* Esto permite estilos dinmicos basados en dark/light mode
*/
export const createStyles = (theme: TodosTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    centerContent: {
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: theme.textSecondary,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 20,
      marginTop: 40,
      color: theme.text,
      fontFamily: "SpaceMono",
    },
    inputContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    input: {
      flex: 1,
      backgroundColor: theme.surface,
      padding: 15,
      borderRadius: 10,
      fontSize: 16,
      marginRight: 10,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    addButton: {
      backgroundColor: theme.primary,
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonText: {
      color: theme.primaryText,
      fontSize: 30,
      fontWeight: "bold",
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 20,
    },
    todoItem: {
      flexDirection: "row",
      backgroundColor: theme.surface,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    todoContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.primary,
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxChecked: {
      backgroundColor: theme.primary,
    },
    checkmark: {
      color: theme.primaryText,
      fontSize: 16,
      fontWeight: "bold",
    },
    todoText: {
      fontSize: 16,
      flex: 1,
      color: theme.text,
      fontFamily: "SpaceMono",
    },
    todoTextCompleted: {
      textDecorationLine: "line-through",
      color: theme.textSecondary,
    },
    deleteButton: {
      padding: 8,
    },
    deleteButtonText: {
      fontSize: 20,
    },
    footer: {
      textAlign: "center",
      color: theme.textSecondary,
      marginTop: 10,
      fontSize: 14,
    },
    header: {
    flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#007AFF", marginBottom: 10,
    },
    userAvatarPlaceholder: { width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10, backgroundColor: "#0055CC", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff",
    },
    userAvatarText: { color: "#fff", fontSize: 18, fontWeight: "bold",
    },
    userName: { flex: 1, color: "#fff", fontSize: 16,
    fontWeight: "bold",
    },
    logoutButton: { padding: 10,
    backgroundColor: "#0055CC", borderRadius: 8,
    },
    logoutText: { color: "#fff",
    
    fontWeight: "bold",
    },

  });
 
/**
* Tema por defecto (light mode)
*/
export const defaultLightTheme: TodosTheme = {
  background: "#f5f5f5",
  surface: "#ffffff",
  text: "#000000",
  textSecondary: "#666666",
  primary: "#007AFF",
  primaryText: "#ffffff",
  border: "#e0e0e0",
  placeholder: "#999999",
};
 
/**
* Tema oscuro (dark mode)
*/
export const defaultDarkTheme: TodosTheme = {
  background: "#000000",
  surface: "#1c1c1e",
  text: "#ffffff",
  textSecondary: "#999999",
  primary: "#0A84FF",
  primaryText: "#ffffff",
  border: "#38383a",
  placeholder: "#666666",
};

