import { View, Text, Button, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

interface ResultData {
  score: number;
  correctCount: number;
  totalQuestions: number;
}

export default function ResultScreen() {
  const router = useRouter();
  const { resultData: rawData } = useLocalSearchParams<{
    resultData: string;
  }>();

  const resultData: ResultData = rawData
    ? JSON.parse(rawData)
    : { score: 0, correctCount: 0, totalQuestions: 0 };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hasil Ujian Anda</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>NILAI AKHIR</Text>
        <Text style={styles.scoreValue}>{resultData.score}</Text>
      </View>

      <Text style={styles.detail}>
        Jawaban Benar: {resultData.correctCount} / {resultData.totalQuestions}
      </Text>

      <View style={{ marginTop: 30 }}>
        <Button
          title="Kembali ke Beranda"
          onPress={() => router.replace("/")}
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  scoreContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 12,
  },
  scoreLabel: { fontSize: 14, color: "#666", fontWeight: "600" },
  scoreValue: { fontSize: 48, fontWeight: "bold", color: "#007bff" },
  detail: { fontSize: 16, color: "#333" },
});
