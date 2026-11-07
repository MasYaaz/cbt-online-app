import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Theme } from "../constants/theme";

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

  const isPassed = resultData.score >= 70;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.statusBadge}>
            {isPassed ? "LULUS UJIAN" : "EVALUASI UJIAN"}
          </Text>
          <Text style={styles.scoreTitle}>NILAI AKHIR</Text>

          <View
            style={[
              styles.scoreBadge,
              isPassed ? styles.scoreSuccess : styles.scoreWarning,
            ]}
          >
            <Text
              style={[
                styles.scoreText,
                isPassed ? styles.scoreSuccessText : styles.scoreWarningText,
              ]}
            >
              {resultData.score}
            </Text>
          </View>

          <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Jawaban Benar</Text>
              <Text style={styles.summaryValue}>
                {resultData.correctCount} Soal
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Soal</Text>
              <Text style={styles.summaryValue}>
                {resultData.totalQuestions} Soal
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Beranda"
          activeOpacity={0.8}
          style={styles.btnHome}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.btnHomeText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  container: {
    flex: 1,
    padding: Theme.spacing.md,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginTop: Theme.spacing.md,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: "800",
    color: Theme.colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: Theme.spacing.xs,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
  },
  scoreBadge: {
    width: 120,
    height: 120,
    borderRadius: Theme.borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Theme.spacing.lg,
  },
  scoreSuccess: { backgroundColor: Theme.colors.successLight },
  scoreWarning: { backgroundColor: Theme.colors.warningLight },
  scoreText: { fontSize: 44, fontWeight: "800" },
  scoreSuccessText: { color: Theme.colors.success },
  scoreWarningText: { color: Theme.colors.warning },
  summaryBox: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryLabel: { fontSize: 12, color: Theme.colors.textSecondary },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
    marginTop: 2,
  },
  summaryDivider: { width: 1, backgroundColor: Theme.colors.border },
  btnHome: {
    backgroundColor: Theme.colors.primary,
    minHeight: Theme.touchTarget.minHeight,
    borderRadius: Theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  btnHomeText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
});
