import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from 'expo-router/stack';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/colors';

export default function Layout() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}