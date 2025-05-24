import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

export async function loginWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
}

export async function signupWithEmail(username: string, email: string, password: string) {
  return await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        username: username.trim(),
        full_name: username.trim(),
      },
    },
  });
}

export async function loginWithGoogle(router: any, setLoading: (b: boolean) => void, setError: (msg: string) => void) {
  try {
    setLoading(true);
    setError("");

    const redirectUrl = Linking.createURL("/(main)");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setError(`Google login failed: ${error.message}`);
      Alert.alert("Login Error", error.message);
      return;
    }

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === "success") {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.replace("/(main)");
        } else {
          setError("Authentication failed. Please try again.");
        }
      } else if (result.type === "cancel") {
        setError("Login cancelled");
      } else {
        setError("Login failed. Please try again.");
      }
    } else {
      setError("Failed to initialize Google login");
    }
  } catch (err) {
    console.error("Google login error:", err);
    setError("Google login failed. Please try again.");
    Alert.alert("Error", "Google login failed. Please try again.");
  } finally {
    setLoading(false);
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    Alert.alert("Logout Gagal", error.message);
  } else {
    Alert.alert("Logout Berhasil");
    router.replace("/auth");
  }
}
