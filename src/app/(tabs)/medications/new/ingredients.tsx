import Footer from "@/components/medication/new/footer";
import Header from "@/components/medication/new/header";
import { useRouter } from "expo-router";
import { View } from "react-native";


export default function IngredientsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 flex-1">
        <Header currentStep={2} />

        <View className="flex-1">
        </View>
      </View>

      <Footer onBack={() => router.back()} onNext={() => router.push("/medications/new/kinetics")} />
    </View>
  );
}
