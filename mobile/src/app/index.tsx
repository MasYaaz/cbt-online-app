import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ujian CBT Online</Text>
      <Text style={styles.subtitle}>Ketentuan Ujian:</Text>
      <Text style={styles.info}>• Pilihan Ganda A-D</Text>
      <Text style={styles.info}>• Nilai berbasis jumlah total soal</Text>
      <Text style={styles.info}>• Waktu: 60 Menit</Text>

      <View style={{ marginTop: 24, gap: 10, width: "100%" }}>
        <Button title="Mulai Ujian" onPress={() => router.push("/quiz")} />
        <Button
          title="Kelola Soal (Admin)"
          color="#6c757d"
          onPress={() => router.push("/admin")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  info: { fontSize: 14, alignSelf: "flex-start", marginVertical: 4 },
});
