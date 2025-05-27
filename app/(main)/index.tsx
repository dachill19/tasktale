import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import { Text, View } from "tamagui";

export default function App() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const handleSave = () => {
        // Logic simpan data
        console.log("Save clicked");
        setOpen(false);
    };

    const handleCancel = () => {
        console.log("Cancel clicked");
        setOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from("journals").select("*");
            if (error) {
                setError(error.message);
            } else {
                setData(data);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <View gap="$4" justifyContent="center" alignItems="center">
            <Text>Data dari Supabase:</Text>
            {data.map((item, index) => (
                <Text key={index}>{JSON.stringify(item)}</Text>
            ))}
        </View>
    );
}
