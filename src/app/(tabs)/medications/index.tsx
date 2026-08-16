import Fab from "@/components/fab";
import { Plus } from "lucide-react-native";
import { Text, View } from "react-native";

export default function MedicationsScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <Text className="text-3xl text-black dark:text-white">Medications</Text>
      <Fab onPress={() => {}} icon={Plus} label="Add medication" />
    </View>
  );
}
