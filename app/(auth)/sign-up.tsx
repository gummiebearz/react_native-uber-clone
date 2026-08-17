import { Alert, Image, ScrollView, Text, View } from "react-native";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useAuth, useSignUp } from "@clerk/expo";
import { ReactNativeModal } from "react-native-modal";

const SignUp = () => {
  const { signUp, errors } = useSignUp();
  const { isLoaded } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    const { error } = await signUp.password({
      emailAddress: form.email,
      password: form.password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));

      // setVerification((_prev) => ({
      //   ..._prev,
      //   error: error?.errors[0]?.longMessage || "Unable to create account",
      //   state: "error",
      // }));

      Alert.alert("Error", error.errors[0].longMessage);

      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      console.error(JSON.stringify(sendError, null, 2));
      setVerification((_prev) => ({
        ..._prev,
        error:
          sendError?.errors[0]?.longMessage ||
          "Unable to send verification code",
        state: "error",
      }));

      return;
    }

    setVerification((_prev) => ({
      ..._prev,
      state: "pending",
    }));
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    const { error } = await signUp.verifications.verifyEmailCode({
      code: verification.code,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));

      setVerification((_prev) => ({
        ..._prev,
        error: error?.errors[0]?.longMessage || "Unable to verify account",
        state: "failed",
      }));

      return;
    }

    if (signUp.status !== "complete") {
      setVerification((_prev) => ({
        ..._prev,
        error: "Verification failed",
        state: "failed",
      }));

      return;
    }

    if (!signUp.createdUserId) {
      setVerification((_prev) => ({
        ..._prev,
        error: "Unable to retrieve user information",
        state: "failed",
      }));

      return;
    }

    // TODO: Insert new user to database

    // Make new Clerk session active
    const { error: finalizeError } = await signUp.finalize();

    if (finalizeError) {
      console.error(JSON.stringify(finalizeError, null, 2));

      setVerification((_prev) => ({
        ..._prev,
        error:
          finalizeError?.errors[0]?.longMessage || "Unable to complete sign up",
        state: "failed",
      }));

      return;
    }

    setVerification((_prev) => ({
      ..._prev,
      state: "success",
    }));
  };

  return (
    <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) =>
              setForm({
                ...form,
                name: value,
              })
            }
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) =>
              setForm({
                ...form,
                email: value,
              })
            }
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) =>
              setForm({
                ...form,
                password: value,
              })
            }
          />

          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        {/* Verification modal */}

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success")
              setShowSuccessModal(() => true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We have sent a verification code to {form.email}
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification((_prev) => ({
                  ..._prev,
                  code,
                }))
              }
            />

            {verification.error && (
              <Text className="text-red-500 text-sm my-2">
                {verification.error}
              </Text>
            )}

            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-6 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>

            <CustomButton
              title="Browse Home"
              onPress={() => {
                router.replace("/(root)/(tabs)/home");
                setShowSuccessModal(() => false);
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
