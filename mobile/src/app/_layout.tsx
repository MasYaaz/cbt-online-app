import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
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
    </Stack>
  );
}
