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
import { useRouter } from "expo-router";
import API from "../services/api";

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
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60 menit (3600 detik)
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

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

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
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Belum ada soal yang tersedia.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>
          Soal {currentIndex + 1} dari {questions.length}
        </Text>
        <Text style={styles.timer}>⏱️ {formatTime(timeLeft)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>{currentQuestion.question}</Text>

        {Object.entries(currentQuestion.options).map(([key, value]) => {
          const isSelected = answers[currentQuestion.id] === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.optionCard, isSelected && styles.selectedCard]}
              onPress={() => handleSelectOption(key)}
            >
              <Text
                style={[styles.optionText, isSelected && styles.selectedText]}
              >
                {key}. {value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={currentIndex === 0}
          style={[styles.btnNav, currentIndex === 0 && styles.btnDisabled]}
          onPress={() => setCurrentIndex((prev) => prev - 1)}
        >
          <Text style={styles.btnText}>Sebelumnya</Text>
        </TouchableOpacity>

        {currentIndex === questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.btnNav, styles.btnFinish]}
            onPress={handleSubmit}
          >
            <Text style={styles.btnText}>Finish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btnNav}
            onPress={() => setCurrentIndex((prev) => prev + 1)}
          >
            <Text style={styles.btnText}>Selanjutnya</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
  },
  progress: { fontSize: 16, fontWeight: "bold" },
  timer: { fontSize: 16, fontWeight: "bold", color: "#d9534f" },
  content: { padding: 20 },
  question: { fontSize: 18, fontWeight: "600", marginBottom: 20 },
  optionCard: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  selectedCard: { backgroundColor: "#007bff", borderColor: "#007bff" },
  optionText: { fontSize: 16, color: "#333" },
  selectedText: { color: "#fff", fontWeight: "bold" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
  },
  btnNav: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#6c757d",
    borderRadius: 6,
  },
  btnFinish: { backgroundColor: "#28a745" },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: "#fff", fontWeight: "bold" },
});
