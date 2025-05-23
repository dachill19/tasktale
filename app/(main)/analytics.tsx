// LoginScreen.tsx
import { supabase } from "@/utils/supabase"; // ganti path sesuai struktur project-mu
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        Alert.alert("Logout Gagal", error.message);
    } else {
        Alert.alert("Logout Berhasil");
        // Arahkan user ke halaman login (jika pakai React Navigation)
        // navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
    }
};

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert("Login Gagal", error.message);
        } else {
            Alert.alert("Login Berhasil", "Selamat datang!");
            // Arahkan ke halaman utama, misalnya dengan navigation.navigate('Home')
        }

        setLoading(false);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

            <Text>Email</Text>
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 5,
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
            />

            <Text>Password</Text>
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 5,
                }}
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />

            <Button
                title={loading ? "Logging in..." : "Login"}
                onPress={handleLogin}
                disabled={loading}
            />
            <Button
                title={loading ? "Logging out..." : "Logout"}
                onPress={handleLogout}
                disabled={loading}
            />
        </View>
    );
}
