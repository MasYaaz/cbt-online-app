import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../constants/theme";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Text style={styles.badge}>PORTAL UJIAN</Text>
          <Text style={styles.heroTitle}>Computer Based Test</Text>
          <Text style={styles.heroSubtitle}>
            Selamat datang di aplikasi ujian online. Pastikan koneksi dan waktu
            Anda cukup sebelum memulai.
          </Text>
        </View>

        {/* Section Info / Ketentuan Ujian */}
        <Text style={styles.sectionHeader}>Ketentuan Ujian</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color={Theme.colors.primary}
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Tipe Soal</Text>
              <Text style={styles.infoDesc}>Pilihan Ganda (A - D)</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name="time-outline"
                size={22}
                color={Theme.colors.primary}
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Batas Waktu</Text>
              <Text style={styles.infoDesc}>60 Menit pengerjaan</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name="bar-chart-outline"
                size={22}
                color={Theme.colors.primary}
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Penilaian</Text>
              <Text style={styles.infoDesc}>
                Kalkulasi otomatis setelah selesai
              </Text>
            </View>
          </View>
        </View>

        {/* Call to Actions */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Mulai Ujian Sekarang"
            activeOpacity={0.8}
            style={styles.btnPrimary}
            onPress={() => router.push("/quiz")}
          >
            <Ionicons
              name="play-circle-outline"
              size={20}
              color={Theme.colors.onPrimary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnPrimaryText}>Mulai Ujian Sekarang</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Kelola Soal Admin"
            activeOpacity={0.8}
            style={styles.btnSecondary}
            onPress={() => router.push("/admin")}
          >
            <Ionicons
              name="settings-outline"
              size={18}
              color={Theme.colors.secondary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnSecondaryText}>Kelola Soal (Admin)</Text>
          </TouchableOpacity>
        </View>
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
  heroCard: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginTop: Theme.spacing.sm,
  },
  badge: {
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: Theme.spacing.xs,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Theme.colors.onPrimary,
    marginBottom: Theme.spacing.xs,
  },
  heroSubtitle: { fontSize: 14, color: "#DBEAFE", lineHeight: 20 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  infoCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Theme.spacing.xs,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  infoTextContainer: { flex: 1 },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
  },
  infoDesc: { fontSize: 13, color: Theme.colors.textSecondary },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: Theme.spacing.xs,
  },
  actionContainer: { gap: Theme.spacing.sm, marginBottom: Theme.spacing.md },
  btnPrimary: {
    backgroundColor: Theme.colors.primary,
    minHeight: Theme.touchTarget.minHeight,
    borderRadius: Theme.borderRadius.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnPrimaryText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  btnSecondary: {
    backgroundColor: Theme.colors.surfaceVariant,
    minHeight: Theme.touchTarget.minHeight,
    borderRadius: Theme.borderRadius.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnSecondaryText: {
    color: Theme.colors.secondary,
    fontWeight: "700",
    fontSize: 15,
  },
});
