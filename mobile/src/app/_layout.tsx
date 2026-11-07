import { Stack } from "expo-router";
import { Theme } from "../constants/theme";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Theme.colors.surface },
        headerTitleStyle: {
          fontWeight: "700",
          color: Theme.colors.textPrimary,
          fontSize: 18,
        },
        headerTintColor: Theme.colors.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Beranda CBT" }} />
      <Stack.Screen
        name="quiz"
        options={{
          title: "Pengerjaan Ujian",
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: "Hasil Nilai",
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="admin" options={{ title: "Kelola Soal" }} />
    </Stack>
  );
}
