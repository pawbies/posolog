import Footer from "@/components/medication/creation/footer";
import Header from "@/components/medication/creation/header";
import { useRouter } from "expo-router";
import { View } from "react-native";


export default function KineticsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="px-4 flex-1">
        <Header currentStep={3} />

        <View className="flex-1">
        </View>
      </View>

      <Footer onBack={() => router.back()} onNext={() => router.push("/medications")} nextLabel="Finish" />
    </View>
  );
}
