import {useState} from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import {styles} from "@/assets/styles/auth.styles.js";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../constants/colors";
import {Image} from "expo-image";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  const onSignUpPress = async () => {
    if (!isLoaded) return

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err) {
      if(err.errors?.[0]?.code === "form_identifier_exists"){
        setError("That email is already in use. Please try with another email.");
      }else{
        setError("An error occurred. Please try again.");
      }
      console.log(err);
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email  </Text>

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
          style={[styles.verificationInput,error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code  "
          placeholderTextColor="#9A8478"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText }>Verify  </Text>
        </TouchableOpacity>
      </View>
    )
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
      <Image source={require("../../assets/images/revenue-i2.png")} style={styles.illustration} /> 

      <Text style={styles.title}>Create Account </Text>

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
        style={[styles.input,error && styles.errorInput]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email "
        placeholderTextColor="#9A8478"
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        style={[styles.input,error && styles.errorInput]}
        value={password}
        placeholder="Enter password "
        placeholderTextColor="#9A8478"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
        <Text style={styles.buttonText}>Sign Up </Text>
      </TouchableOpacity>
      
      <View style={styles.footerContainer}>
      <Text style={styles.footerText}>Already have an account?  </Text>
      <TouchableOpacity onPress={()=>router.back()}>
      <Text style={styles.linkText}>Sign in </Text> 
      </TouchableOpacity>
      </View>
      </View>
    </KeyboardAwareScrollView>
  );  
}