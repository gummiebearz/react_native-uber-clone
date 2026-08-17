import { Text } from "react-native";
import { Show, useUser } from "@clerk/expo";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user } = useUser();

  return (
    <SafeAreaView>
      <Show when="signed-in">
        <Text>Hello, {user?.emailAddresses[0].emailAddress}</Text>
      </Show>
      <Show when="signed-out">
        <Link href="/sign-in">
          <Text>Sign In</Text>
        </Link>
        <Link href="/sign-up">
          <Text>Sign Up</Text>
        </Link>
      </Show>
    </SafeAreaView>
  );
};

export default Home;
