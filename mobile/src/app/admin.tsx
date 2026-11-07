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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import API from "../services/api";
import { Theme } from "../constants/theme";

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
  const [uploading, setUploading] = useState(false);

  // Form State
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

  const handleImportCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "application/csv"],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const file = result.assets[0];
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "text/csv",
      } as any);

      setUploading(true);
      const response = await API.post("/admin/questions/import-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploading(false);
      Alert.alert(
        "Sukses",
        response.data.message || "Berhasil mengimpor soal!",
      );
      fetchQuestions();
    } catch (error: any) {
      setUploading(false);
      const errMsg =
        error.response?.data?.error || "Gagal mengunggah file CSV.";
      Alert.alert("Error", errMsg);
    }
  };

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Action Bar */}
        <View style={styles.topActions}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Tambah Soal Manual"
            activeOpacity={0.8}
            style={[
              styles.btnAction,
              { backgroundColor: Theme.colors.primary },
            ]}
            onPress={() => openModal()}
          >
            <Ionicons
              name="add-circle-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.btnActionText}>Tambah Manual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Import Soal dari CSV"
            activeOpacity={0.8}
            disabled={uploading}
            style={[
              styles.btnAction,
              { backgroundColor: Theme.colors.success },
            ]}
            onPress={handleImportCSV}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.btnActionText}>Import CSV</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <FlatList
          data={questions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.qText}>
                {index + 1}. {item.question}
              </Text>
              <View style={styles.optGrid}>
                <Text style={styles.optText}>
                  <Text style={styles.optKey}>A:</Text> {item.optionA}
                </Text>
                <Text style={styles.optText}>
                  <Text style={styles.optKey}>B:</Text> {item.optionB}
                </Text>
                <Text style={styles.optText}>
                  <Text style={styles.optKey}>C:</Text> {item.optionC}
                </Text>
                <Text style={styles.optText}>
                  <Text style={styles.optKey}>D:</Text> {item.optionD}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.ansBadge}>
                  <Text style={styles.ansText}>
                    Kunci:{" "}
                    <Text style={{ fontWeight: "800" }}>{item.answer}</Text>
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    style={styles.btnEdit}
                    onPress={() => openModal(item)}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={14}
                      color={Theme.colors.textPrimary}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityRole="button"
                    style={styles.btnDelete}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={14}
                      color={Theme.colors.error}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[styles.actionText, { color: Theme.colors.error }]}
                    >
                      Hapus
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />

        {/* Modal Form Editor */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView
            style={{ flex: 1, backgroundColor: Theme.colors.background }}
          >
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingId ? "Edit Soal" : "Tambah Soal Baru"}
              </Text>

              <Text style={styles.label}>Pertanyaan</Text>
              <TextInput
                style={[styles.input, { minHeight: 80 }]}
                multiline
                placeholder="Tuliskan pertanyaan di sini..."
                value={questionText}
                onChangeText={setQuestionText}
              />

              <Text style={styles.label}>Pilihan A</Text>
              <TextInput
                style={styles.input}
                value={optA}
                onChangeText={setOptA}
              />

              <Text style={styles.label}>Pilihan B</Text>
              <TextInput
                style={styles.input}
                value={optB}
                onChangeText={setOptB}
              />

              <Text style={styles.label}>Pilihan C</Text>
              <TextInput
                style={styles.input}
                value={optC}
                onChangeText={setOptC}
              />

              <Text style={styles.label}>Pilihan D</Text>
              <TextInput
                style={styles.input}
                value={optD}
                onChangeText={setOptD}
              />

              <Text style={styles.label}>Kunci Jawaban</Text>
              <View style={styles.keyBadgeRow}>
                {(["A", "B", "C", "D"] as const).map((key) => (
                  <TouchableOpacity
                    key={key}
                    accessibilityRole="button"
                    style={[
                      styles.keyBadge,
                      answerKey === key && styles.keySelected,
                    ]}
                    onPress={() => setAnswerKey(key)}
                  >
                    <Text
                      style={[
                        styles.keyBadgeText,
                        answerKey === key && styles.keySelectedText,
                      ]}
                    >
                      {key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.btnCancelText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                  <Text style={styles.btnSaveText}>Simpan</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  container: { flex: 1, padding: Theme.spacing.md },
  topActions: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  btnAction: {
    flex: 1,
    flexDirection: "row",
    minHeight: Theme.touchTarget.minHeight,
    borderRadius: Theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  btnActionText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  qText: {
    fontSize: 15,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },
  optGrid: { gap: 2, marginVertical: Theme.spacing.xs },
  optText: { fontSize: 13, color: Theme.colors.textSecondary },
  optKey: { fontWeight: "700", color: Theme.colors.textPrimary },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Theme.spacing.sm,
    paddingTop: Theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  ansBadge: {
    backgroundColor: Theme.colors.successLight,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
  },
  ansText: { fontSize: 12, color: Theme.colors.success, fontWeight: "600" },
  actionRow: { flexDirection: "row", gap: Theme.spacing.xs },
  btnEdit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.warningLight,
    paddingHorizontal: Theme.spacing.md,
    minHeight: 36,
    borderRadius: Theme.borderRadius.sm,
  },
  btnDelete: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.errorLight,
    paddingHorizontal: Theme.spacing.md,
    minHeight: 36,
    borderRadius: Theme.borderRadius.sm,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
  },
  modalContent: { flex: 1, padding: Theme.spacing.lg },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.sm,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    marginTop: 4,
    fontSize: 14,
    color: Theme.colors.textPrimary,
  },
  keyBadgeRow: {
    flexDirection: "row",
    gap: Theme.spacing.xs,
    marginVertical: Theme.spacing.sm,
  },
  keyBadge: {
    flex: 1,
    minHeight: Theme.touchTarget.minHeight,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
  },
  keySelected: {
    backgroundColor: Theme.colors.success,
    borderColor: Theme.colors.success,
  },
  keyBadgeText: { fontWeight: "700", color: Theme.colors.textPrimary },
  keySelectedText: { color: Theme.colors.onPrimary },
  modalActions: {
    flexDirection: "row",
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  btnCancel: {
    flex: 1,
    minHeight: Theme.touchTarget.minHeight,
    backgroundColor: Theme.colors.surfaceVariant,
    borderRadius: Theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancelText: { fontWeight: "700", color: Theme.colors.secondary },
  btnSave: {
    flex: 1,
    minHeight: Theme.touchTarget.minHeight,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  btnSaveText: { fontWeight: "700", color: Theme.colors.onPrimary },
});
