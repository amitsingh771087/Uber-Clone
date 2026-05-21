import { Stack } from "expo-router";

import "../global.css";

// Keep the splash screen visible while we fetch resources

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="not-found" />
    </Stack>
  );
}
