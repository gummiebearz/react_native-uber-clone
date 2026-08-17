import { Alert, Image, ScrollView, Text, View } from "react-native";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/expo";

const SignIn = () => {
  const { signIn } = useSignIn();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: form.email,
      password: form.password,
    });

    if (error) {
      console.error(JSON.stringify(error), null, 2);

      Alert.alert("Error", error?.errors[0].longMessage);

      return;
    }

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize();

      if (finalizeError) {
        console.error(JSON.stringify(finalizeError, null, 2));
        Alert.alert("Error", finalizeError?.errors[0].longMessage);

        return;
      }

      router.replace("/(root)/(tabs)/home");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome
          </Text>
        </View>
        <View className="p-5">
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
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Don't have an account? </Text>
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>

        {/* Verification modal */}
      </View>
    </ScrollView>
  );
};

export default SignIn;
