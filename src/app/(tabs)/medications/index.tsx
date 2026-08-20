import Fab from "@/components/fab";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { Text, View } from "react-native";

export default function MedicationsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <Text className="text-3xl text-black dark:text-white">Medications</Text>
      <Fab onPress={() => router.push("/medications/creation/basic-information") } icon={Plus} label="Add medication" />
    </View>
  );
}
