import Pressable from "@/components/pressable";
import Text from "@/components/text";
import * as WebBrowser from "expo-web-browser";
import {
  Ban,
  ClipboardList,
  Code,
  ExternalLink,
  History,
  Scale,
  Stethoscope,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LAST_UPDATED = "August 25, 2026";
const CONTACT_URL = "https://github.com/pawbies/posolog/issues";

type SectionProps = {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  children: string;
};

function Section({ icon: Icon, iconColor, title, children }: SectionProps) {
  return (
    <View className="bg-surface rounded-2xl p-4 mb-4">
      <View className="flex-row items-center mb-2">
        <Icon size={20} color={iconColor} />
        <Text className="text-base font-medium ml-2">{title}</Text>
      </View>
      <Text muted className="text-base leading-6">
        {children}
      </Text>
    </View>
  );
}

export default function TermsOfServiceScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const chevronMuted = colorScheme === "dark" ? "#71717a" : "#a1a1aa";

  return (
    <ScrollView
      className="px-4 flex-1 bg-background"
      contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom }}
    >
      <Text muted className="text-sm text-center mb-6">
        Last updated {LAST_UPDATED}
      </Text>

      <View className="bg-surface rounded-2xl p-4 mb-4">
        <Text muted className="text-base leading-6">
          These terms cover your use of posolog. By using the app, you agree to them — please
          read the medical disclaimer below carefully, since it's the most important part.
        </Text>
      </View>

      <Section icon={Stethoscope} iconColor="#ef4444" title="Medical disclaimer">
        posolog is a personal tracking and calculation tool, not a medical device. The
        pharmacokinetic estimates, plasma curves, and other calculations it produces are for
        informational and educational purposes only — they are not medical advice and not a
        substitute for professional judgment. Always consult a licensed physician or pharmacist
        before making any decision about your medication, dosing, or treatment. Never start,
        stop, or change a medication based solely on what this app shows you.
      </Section>

      <Section icon={ClipboardList} iconColor="#3b82f6" title="Your data and responsibility">
        You're responsible for the accuracy of the medication and health data you enter. posolog
        calculates results based on exactly what you input — it doesn't verify accuracy, check
        for drug interactions, or know your medical history. There's no account or login, so
        you're also responsible for keeping your device itself secure, since anyone with access
        to it can view or edit your data.
      </Section>

      <Section icon={TriangleAlert} iconColor="#f97316" title="No warranty">
        posolog is provided "as is" and "as available," without warranties of any kind, express
        or implied. We don't guarantee the app will be error-free or uninterrupted, or that its
        calculations will be accurate or appropriate for your specific situation. You use it at
        your own risk.
      </Section>

      <Section icon={Scale} iconColor="#a855f7" title="Limitation of liability">
        To the fullest extent permitted by law, the developers of posolog aren't liable for any
        harm, loss, or damages — including health-related harm — arising from your use of the app
        or reliance on the information it provides. posolog is a free, independently developed
        tool and not a certified medical product.
      </Section>

      <Section icon={Code} iconColor="#22c55e" title="Open source">
        posolog's source code is publicly available at github.com/pawbies/posolog, under the
        license included in that repository. You're welcome to read, audit, or contribute to it.
      </Section>

      <Section icon={History} iconColor="#71717a" title="Changes to these terms">
        These terms may be updated as posolog evolves. Continuing to use the app after a change
        means you accept the updated terms — the "last updated" date at the top will always
        reflect the most recent version.
      </Section>

      <Section icon={Ban} iconColor="#ec4899" title="Ending your use">
        You can stop using posolog and uninstall it at any time. Since there's no account, there's
        nothing further to cancel — deleting the app removes its locally stored data, aside from
        anything already included in a device backup.
      </Section>

      <View className="mb-2">
        <Text muted className="text-base ml-1 mb-2">
          Contact
        </Text>
        <Pressable
          onPress={async () => await WebBrowser.openBrowserAsync(CONTACT_URL)}
          className="bg-surface rounded-2xl p-4 flex-row items-center"
        >
          <ExternalLink size={20} color={chevronMuted} />
          <View className="flex-1 ml-3">
            <Text className="text-base">Questions about these terms?</Text>
            <Text muted className="text-sm mt-0.5">Open an issue on GitHub</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}
