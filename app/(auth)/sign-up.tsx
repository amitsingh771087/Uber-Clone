import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { VerificationProps } from "@/types/type";
import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";

const SignUp = () => {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [showSuccessModel, setShowSuccessModel] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState<VerificationProps>({
    state: "default",
    error: "",
    code: "",
  });

  if (!signUp) return null;

  const onSignUpPress = async () => {
    try {
      const { error } = await signUp.password({
        emailAddress: form.email,
        password: form.password,
      });

      if (error) {
        const clerkError = error as any;

        Alert.alert(
          "Sign Up Error",
          clerkError.errors?.[0]?.longMessage ||
            "An error occurred during sign up.",
        );

        return;
      }

      await signUp.verifications.sendEmailCode();

      setVerification({
        state: "pending",
        error: "",
        code: "",
      });
    } catch (error: any) {
      Alert.alert(
        "Unexpected Error",
        error?.errors?.[0]?.longMessage ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const handleVerify = async () => {
    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: verification.code as string,
      });

      if (error) {
        const clerkError = error as any;
        setVerification((prev) => ({
          ...prev,
          state: "failed",
          error: clerkError.errors?.[0]?.longMessage || "Verification failed",
        }));
        return;
      }

      // close verification modal
      setVerification({
        state: "default",
        error: "",
        code: "",
      });

      // open success modal after verification modal fully closes
      setTimeout(() => {
        setShowSuccessModel(true);
      }, 500);

      console.log("Success modal opened");
    } catch (err: any) {
      console.log(err);

      setVerification((prev) => ({
        ...prev,
        state: "failed",
        error: err?.errors?.[0]?.longMessage || "Verification failed",
      }));
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        {/* Header Image */}
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />

          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>

        {/* Form */}
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter Your Name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

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
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/(auth)/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already Have an Account? </Text>
            <Text className="text-primary-500">Sign In</Text>
          </Link>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModel(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verify Email
            </Text>

            <Text className="font-Jakarta mb-5">
              We sent a verification code to {form.email}
            </Text>

            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="123456"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />

            {verification.error ? (
              <Text className="text-red-500 text-sm mt-2">
                {verification.error}
              </Text>
            ) : null}

            <CustomButton
              title="Verify Email"
              onPress={handleVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        {/* Success Modal */}
        <ReactNativeModal isVisible={showSuccessModel}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />

            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>

            <Text className="text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account
            </Text>

            <CustomButton
              title="Browse Home"
              onPress={async () => {
                try {
                  setShowSuccessModel(false);

                  await signUp.finalize({
                    navigate: async () => {},
                  });

                  setTimeout(() => {
                    router.push("/(root)/(tabs)/home");
                  }, 300);
                } catch (err) {
                  console.log(err);
                  Alert.alert("Error", "Failed to login");
                }
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
