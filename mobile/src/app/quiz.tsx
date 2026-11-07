import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import API from "../services/api";
import { Theme } from "../constants/theme";

interface QuestionOption {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface Question {
  id: number;
  question: string;
  options: QuestionOption;
}

export default function QuizScreen() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    API.get<Question[]>("/questions")
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert("Error", "Gagal memuat soal dari server.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      Alert.alert("Waktu Habis!", "Ujian akan otomatis dikirimkan.", [
        { text: "OK", onPress: handleSubmit },
      ]);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, answers]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSelectOption = (optionKey: string) => {
    const currentQId = questions[currentIndex].id;
    setAnswers((prev) => ({ ...prev, [currentQId]: optionKey }));
  };

  const handleSubmit = async () => {
    try {
      const response = await API.post("/submit", { answers });
      router.replace({
        pathname: "/result",
        params: { resultData: JSON.stringify(response.data) },
      });
    } catch {
      Alert.alert("Error", "Gagal mengirimkan jawaban ke server.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Memuat lembar soal...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Theme.colors.textSecondary }}>
          Belum ada soal yang tersedia.
        </Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Indicator */}
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.progressLabel}>PROGRES UJIAN</Text>
            <Text style={styles.progressText}>
              Soal <Text style={styles.highlightText}>{currentIndex + 1}</Text>{" "}
              / {questions.length}
            </Text>
          </View>
          <View
            style={[styles.timerBadge, timeLeft < 300 && styles.timerWarning]}
          >
            <Ionicons
              name="timer-outline"
              size={16}
              color={
                timeLeft < 300 ? Theme.colors.error : Theme.colors.textPrimary
              }
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.timerText,
                timeLeft < 300 && styles.timerWarningText,
              ]}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        {/* Content Question */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          <Text style={styles.selectHint}>Pilih Salah Satu Jawaban:</Text>

          {Object.entries(currentQuestion.options).map(([key, value]) => {
            const isSelected = answers[currentQuestion.id] === key;
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Pilihan ${key}: ${value}`}
                style={[
                  styles.optionCard,
                  isSelected && styles.selectedOptionCard,
                ]}
                onPress={() => handleSelectOption(key)}
              >
                <View
                  style={[
                    styles.radioBadge,
                    isSelected && styles.selectedRadioBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.radioText,
                      isSelected && styles.selectedRadioText,
                    ]}
                  >
                    {key}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.footerNav}>
          <TouchableOpacity
            disabled={currentIndex === 0}
            accessibilityRole="button"
            accessibilityLabel="Soal Sebelumnya"
            style={[styles.btnNav, currentIndex === 0 && styles.btnDisabled]}
            onPress={() => setCurrentIndex((prev) => prev - 1)}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={Theme.colors.textPrimary}
            />
            <Text style={styles.btnNavText}>Sebelumnya</Text>
          </TouchableOpacity>

          {currentIndex === questions.length - 1 ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Kirim Jawaban dan Finish"
              style={[styles.btnNav, styles.btnFinish]}
              onPress={handleSubmit}
            >
              <Text style={[styles.btnNavText, { color: "#fff" }]}>Finish</Text>
              <Ionicons
                name="checkmark-done"
                size={18}
                color="#fff"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Soal Selanjutnya"
              style={[styles.btnNav, styles.btnNext]}
              onPress={() => setCurrentIndex((prev) => prev + 1)}
            >
              <Text style={[styles.btnNavText, { color: "#fff" }]}>
                Selanjutnya
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    marginTop: Theme.spacing.sm,
    color: Theme.colors.textSecondary,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  progressText: {
    fontSize: 15,
    fontWeight: "600",
    color: Theme.colors.textPrimary,
  },
  highlightText: { color: Theme.colors.primary, fontWeight: "800" },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceVariant,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
  },
  timerWarning: { backgroundColor: Theme.colors.errorLight },
  timerWarningText: { color: Theme.colors.error },
  scrollContent: { padding: Theme.spacing.md },
  questionCard: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.md,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.colors.textPrimary,
    lineHeight: 24,
  },
  selectHint: {
    fontSize: 13,
    fontWeight: "600",
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: Theme.touchTarget.minHeight,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.sm,
  },
  selectedOptionCard: {
    backgroundColor: Theme.colors.primaryLight,
    borderColor: Theme.colors.primary,
  },
  radioBadge: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  selectedRadioBadge: { backgroundColor: Theme.colors.primary },
  radioText: { fontSize: 14, fontWeight: "700", color: Theme.colors.secondary },
  selectedRadioText: { color: Theme.colors.onPrimary },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: Theme.colors.textPrimary,
    lineHeight: 20,
  },
  selectedOptionText: { color: Theme.colors.primary, fontWeight: "700" },
  footerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    gap: Theme.spacing.md,
  },
  btnNav: {
    flex: 1,
    flexDirection: "row",
    minHeight: Theme.touchTarget.minHeight,
    borderRadius: Theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceVariant,
  },
  btnNext: { backgroundColor: Theme.colors.primary },
  btnFinish: { backgroundColor: Theme.colors.success },
  btnDisabled: { opacity: 0.4 },
  btnNavText: {
    color: Theme.colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
    marginHorizontal: 4,
  },
});
