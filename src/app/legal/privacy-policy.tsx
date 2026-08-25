import Pressable from "@/components/pressable";
import Text from "@/components/text";
import * as WebBrowser from "expo-web-browser";
import {
  Baby,
  Database,
  ExternalLink,
  History,
  Lock,
  ServerOff,
  Share2,
  ShieldOff,
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

export default function PrivacyPolicyScreen() {
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
          posolog was built to be privacy-first. This page explains what data the app handles,
          where it lives, and the choices you have. In short: everything you log stays on your
          device unless you decide to share it yourself.
        </Text>
      </View>

      <Section icon={Database} iconColor="#3b82f6" title="Data we store">
        The medications and blood pressure readings you log, along with basic app preferences
        (like your security settings), are saved directly on your device. There are no accounts
        or sign-in, so posolog never collects your name, email address, or any other profile
        information — it has no way to.
      </Section>

      <Section icon={ServerOff} iconColor="#ef4444" title="No servers, no tracking">
        posolog doesn't have a backend. Your health data is never sent over the internet — the
        app contains no analytics, no crash reporting, and no advertising SDKs. Everything is
        stored locally in an on-device database. Note that your phone's own backup system (such
        as iCloud or Google backup, if you have it enabled) may include this local data as part
        of your regular device backups — that's controlled by your device's settings, not by
        posolog.
      </Section>

      <Section icon={Share2} iconColor="#22c55e" title="Export & import">
        You can export your data as a file at any time from the Export screen. This opens your
        device's native share sheet, so you choose exactly where the file goes — posolog never
        uploads it anywhere on its own. You can bring that same file back in from the Import
        screen. If you delete the app, its locally stored data is removed with it, aside from
        anything already included in a device backup.
      </Section>

      <Section icon={Lock} iconColor="#f97316" title="Security">
        Settings includes an optional "Prevent Screen Capture" toggle that blocks screenshots and
        recordings and hides the app preview in the app switcher. Beyond that, your data is
        protected by your device's standard storage security — posolog doesn't apply any
        additional encryption of its own.
      </Section>

      <Section icon={ShieldOff} iconColor="#a855f7" title="Third parties">
        posolog doesn't use third-party analytics, advertising, or tracking of any kind, and
        there's nothing to opt out of because nothing is being collected in the first place. If a
        feature that involves a third party (such as donations) is ever added, this policy will
        be updated first to describe it.
      </Section>

      <Section icon={Baby} iconColor="#ec4899" title="Children">
        posolog isn't directed at children, and we don't knowingly collect data from anyone under
        13. Since all data stays on-device under your control, a parent or guardian is free to use
        the app to track a child's medications or readings themselves.
      </Section>

      <Section icon={History} iconColor="#71717a" title="Changes to this policy">
        This policy may be updated as posolog evolves, for example if new optional features are
        added. The "last updated" date at the top will always reflect the most recent version.
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
            <Text className="text-base">Questions about this policy?</Text>
            <Text muted className="text-sm mt-0.5">Open an issue on GitHub</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}
