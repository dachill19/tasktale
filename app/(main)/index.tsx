import { FormDialog } from "@/components/FormDialog";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import { Fieldset, Input, Label, Text, View } from "tamagui";

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
            <FormDialog
                open={open}
                onOpenChange={setOpen}
                title="Edit profile"
                description="Make changes to your profile here. Click save when you're done."
                onSave={handleSave}
                onCancel={handleCancel}
            >
                <Fieldset gap="$4" horizontal>
                    <Label width={64} htmlFor="name">
                        Name
                    </Label>
                    <Input flex={1} id="name" defaultValue="Nate Wienert" />
                </Fieldset>
            </FormDialog>
        </View>
    );
}
