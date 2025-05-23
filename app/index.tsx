import { Redirect } from "expo-router";
// import { useAuth } from "@/lib/useAuth"; // contoh hook buatan kamu

export default function Index() {
    // const { user } = useAuth();

    // Jika belum login, arahkan ke auth
    // if (!user) {
    //     return <Redirect href="/(auth)/" />;
    // }

    // Jika sudah login, masuk ke main
    return <Redirect href="/(main)" />;
}
