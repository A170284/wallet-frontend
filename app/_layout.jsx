import { Slot } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { StatusBar } from "react-native";


export default function RootLayout() 
{
  return(
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot/>
      </SafeScreen>
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}