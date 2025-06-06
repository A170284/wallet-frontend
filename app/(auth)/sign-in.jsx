import {useState} from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import {Link, useRouter } from 'expo-router';
import {styles} from "@/assets/styles/auth.styles.js";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../constants/colors";
import {Image} from "expo-image";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState("")
  const onSignInPress = async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      if(err.errors?.[0]?.code === "form_password_incorrect"){
        setError("Password is incorrect. Please try again.");
      }else if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("Email not found. Please check your email or sign up.")
      }
      else if (err.errors?.[0]?.code === "form_identifier_invalid") {
        setError("Email is invalid. Please enter a valid email address.");
      }
      else{
        setError("Email is invalid. Please enter a valid email address.");
      }
      console.log(err);
    } 
  }

  return (
    <KeyboardAwareScrollView
    style={{flex:1}}
    contentContainerStyle={{ flexGrow:1}}
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    extraScrollHeight={100}
    >
    <View style={styles.container}>
      <Image source={require("../../assets/images/revenue-i4.png")}
      style={styles.illustration}
      />
      <Text style={styles.title}>Sign in </Text>

      {error? (
        <View style={styles.errorBox}>
        <Ionicons name="alert-circle" size={20} color={COLORS.expense}/>
        <Text style = {styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => setError("")}>
        <Ionicons name="close" size={20} color={COLORS.textLight}/>
        </TouchableOpacity>
        </View>)
      : null }

      <TextInput
        style={[styles.input,error &&styles.errorInput]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#9A8478"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        style={[styles.input,error &&styles.errorInput]}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#9A8478"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity style={styles.button} onPress={onSignInPress}>
        <Text style={styles.buttonText}>Sign In </Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don&apos;t have an account?  </Text>
        <Link href="/sign-up" asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Sign Up </Text>
          </TouchableOpacity>
        </Link>
      </View>
      </View>
    </KeyboardAwareScrollView>
  )
}