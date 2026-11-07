import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import API from "../services/api";

interface QuestionItem {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: "A" | "B" | "C" | "D";
}

export default function AdminScreen() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [questionText, setQuestionText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [answerKey, setAnswerKey] = useState<"A" | "B" | "C" | "D">("A");

  const fetchQuestions = () => {
    API.get<QuestionItem[]>("/admin/questions")
      .then((res) => setQuestions(res.data))
      .catch(() => Alert.alert("Error", "Gagal memuat daftar soal"));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openModal = (item?: QuestionItem) => {
    if (item) {
      setEditingId(item.id);
      setQuestionText(item.question);
      setOptA(item.optionA);
      setOptB(item.optionB);
      setOptC(item.optionC);
      setOptD(item.optionD);
      setAnswerKey(item.answer);
    } else {
      setEditingId(null);
      setQuestionText("");
      setOptA("");
      setOptB("");
      setOptC("");
      setOptD("");
      setAnswerKey("A");
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!questionText || !optA || !optB || !optC || !optD) {
      Alert.alert("Peringatan", "Harap isi semua kolom!");
      return;
    }

    const payload = {
      question: questionText,
      optionA: optA,
      optionB: optB,
      optionC: optC,
      optionD: optD,
      answer: answerKey,
    };

    try {
      if (editingId) {
        await API.put(`/admin/questions/${editingId}`, payload);
      } else {
        await API.post("/admin/questions", payload);
      }
      setModalVisible(false);
      fetchQuestions();
    } catch {
      Alert.alert("Error", "Gagal menyimpan soal");
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Hapus Soal", "Yakin ingin menghapus soal ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await API.delete(`/admin/questions/${id}`);
          fetchQuestions();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnAdd} onPress={() => openModal()}>
        <Text style={styles.btnText}>+ Tambah Soal Baru</Text>
      </TouchableOpacity>

      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.qText}>
              {index + 1}. {item.question}
            </Text>
            <Text style={styles.optText}>
              A: {item.optionA} | B: {item.optionB}
            </Text>
            <Text style={styles.optText}>
              C: {item.optionC} | D: {item.optionD}
            </Text>
            <Text style={styles.ansText}>Kunci Jawaban: {item.answer}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.btnEdit}
                onPress={() => openModal(item)}
              >
                <Text style={{ color: "#fff" }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={{ color: "#fff" }}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingId ? "Edit Soal" : "Tambah Soal Baru"}
          </Text>

          <Text style={styles.label}>Pertanyaan:</Text>
          <TextInput
            style={styles.input}
            multiline
            value={questionText}
            onChangeText={setQuestionText}
          />

          <Text style={styles.label}>Pilihan A:</Text>
          <TextInput style={styles.input} value={optA} onChangeText={setOptA} />

          <Text style={styles.label}>Pilihan B:</Text>
          <TextInput style={styles.input} value={optB} onChangeText={setOptB} />

          <Text style={styles.label}>Pilihan C:</Text>
          <TextInput style={styles.input} value={optC} onChangeText={setOptC} />

          <Text style={styles.label}>Pilihan D:</Text>
          <TextInput style={styles.input} value={optD} onChangeText={setOptD} />

          <Text style={styles.label}>Kunci Jawaban:</Text>
          <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
            {(["A", "B", "C", "D"] as const).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.keyBadge,
                  answerKey === key && styles.keySelected,
                ]}
                onPress={() => setAnswerKey(key)}
              >
                <Text style={{ color: answerKey === key ? "#fff" : "#000" }}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              marginBottom: 40,
            }}
          >
            <TouchableOpacity
              style={[
                styles.btnAdd,
                { backgroundColor: "#6c757d", flex: 1, marginRight: 5 },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnAdd, { flex: 1, marginLeft: 5 }]}
              onPress={handleSave}
            >
              <Text style={styles.btnText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  btnAdd: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  qText: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  optText: { fontSize: 13, color: "#555" },
  ansText: { fontSize: 13, fontWeight: "bold", color: "#28a745", marginTop: 4 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  btnEdit: {
    backgroundColor: "#ffc107",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  btnDelete: {
    backgroundColor: "#dc3545",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  modalContent: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  keyBadge: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  keySelected: { backgroundColor: "#28a745", borderColor: "#28a745" },
});
