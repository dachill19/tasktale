// LoginScreen.tsx
import { logout } from "@/utils/auth";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

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
                title={loading ? "Logging out..." : "Logout"}
                onPress={logout}
                disabled={loading}
            />
        </View>
    );
}
