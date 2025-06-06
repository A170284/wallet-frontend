import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity,Alert } from 'react-native'
import { styles } from "../assets/styles/home.styles"
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import { useRouter } from 'expo-router'

export const SignOutButton = () => {
  const { signOut } = useClerk()
  const router = useRouter()
  const handleSignOut = async () => {
    Alert.alert( // Fixed typo (Alert instead of ALert)
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log-out", 
          style: "destructive", 
          onPress: async () => {
            try {
              await signOut()
              router.replace('/(auth)/sign-in') // Navigate to sign-in after logout
            } catch (error) {
              console.error('Logout failed:', error)
            }
          }
        },
      ]
    )
  }

  return (
    <TouchableOpacity style ={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text}/>
    </TouchableOpacity>
  )
}