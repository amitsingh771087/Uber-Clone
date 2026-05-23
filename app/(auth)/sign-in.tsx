import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";

const SignIn = () => {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [code, setCode] = useState("");

  if (!signIn) return null;

  // SIGN IN
  const onSignInPress = async () => {
    try {
      const { error } = await signIn.password({
        emailAddress: form.email,
        password: form.password,
      });

      if (error) {
        const clerkError = error as any;
        Alert.alert(
          "Sign In Error",
          clerkError.errors?.[0]?.longMessage || "Invalid credentials",
        );
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: async () => {},
        });

        router.replace("/(root)/(tabs)/home");
      } else if (signIn.status === "needs_client_trust") {
        await signIn.mfa.sendEmailCode();
        setShowVerifyModal(true);
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.errors?.[0]?.longMessage || "Something went wrong",
      );
    }
  };

  // VERIFY EMAIL CODE
  const handleVerify = async () => {
    try {
      const { error } = await signIn.mfa.verifyEmailCode({
        code,
      });

      if (error) {
        const clerkError = error as any;
        Alert.alert(
          "Verification Error",
          clerkError.errors?.[0]?.longMessage || "Invalid code",
        );
        return;
      }

      if (signIn.status === "complete") {
        setShowVerifyModal(false);

        await signIn.finalize({
          navigate: async () => {},
        });

        router.replace("/(root)/(tabs)/home");
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.errors?.[0]?.longMessage || "Verification failed",
      );
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />

          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        {/* Form */}
        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter Your Email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter Your Password"
            icon={icons.lock}
            secureTextEntry
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/(auth)/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Don't Have An Account? </Text>
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal isVisible={showVerifyModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaBold mb-5">
              Verify Sign In
            </Text>

            <InputField
              label="Verification Code"
              placeholder="Enter code"
              icon={icons.lock}
              value={code}
              keyboardType="numeric"
              onChangeText={setCode}
            />

            <CustomButton
              title="Verify"
              onPress={handleVerify}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignIn;
