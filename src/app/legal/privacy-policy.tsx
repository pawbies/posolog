import LegalPage, { LegalSection } from "@/components/legal/legal-page";
import {
  Baby,
  Database,
  History,
  Lock,
  ServerOff,
  Share2,
  ShieldOff,
} from "lucide-react-native";

const LAST_UPDATED = "August 25, 2026";

const INTRO =
  "posolog was built to be privacy-first. This page explains what data the app handles, where it lives, and the choices you have. In short: everything you log stays on your device unless you decide to share it yourself.";

export default function PrivacyPolicyScreen() {
  return (
    <LegalPage lastUpdated={LAST_UPDATED} intro={INTRO} contactTitle="Questions about this policy?">
      <LegalSection icon={Database} tone="sky" title="Data we store">
        The medications and blood pressure readings you log, along with basic app preferences
        (like your security settings), are saved directly on your device. There are no accounts
        or sign-in, so posolog never collects your name, email address, or any other profile
        information — it has no way to.
      </LegalSection>

      <LegalSection icon={ServerOff} tone="rose" title="No servers, no tracking">
        posolog doesn't have a backend. Your health data is never sent over the internet — the
        app contains no analytics, no crash reporting, and no advertising SDKs. Everything is
        stored locally in an on-device database. Note that your phone's own backup system (such
        as iCloud or Google backup, if you have it enabled) may include this local data as part
        of your regular device backups — that's controlled by your device's settings, not by
        posolog.
      </LegalSection>

      <LegalSection icon={Share2} tone="mint" title="Export & import">
        You can export your data as a file at any time from the Export screen. This opens your
        device's native share sheet, so you choose exactly where the file goes — posolog never
        uploads it anywhere on its own. You can bring that same file back in from the Import
        screen. If you delete the app, its locally stored data is removed with it, aside from
        anything already included in a device backup.
      </LegalSection>

      <LegalSection icon={Lock} tone="peach" title="Security">
        Settings includes an optional "Prevent Screen Capture" toggle that blocks screenshots and
        recordings and hides the app preview in the app switcher. Beyond that, your data is
        protected by your device's standard storage security — posolog doesn't apply any
        additional encryption of its own.
      </LegalSection>

      <LegalSection icon={ShieldOff} tone="lilac" title="Third parties">
        posolog doesn't use third-party analytics, advertising, or tracking of any kind, and
        there's nothing to opt out of because nothing is being collected in the first place. If a
        feature that involves a third party (such as donations) is ever added, this policy will
        be updated first to describe it.
      </LegalSection>

      <LegalSection icon={Baby} tone="rose" title="Children">
        posolog isn't directed at children, and we don't knowingly collect data from anyone under
        13. Since all data stays on-device under your control, a parent or guardian is free to use
        the app to track a child's medications or readings themselves.
      </LegalSection>

      <LegalSection icon={History} tone="cream" title="Changes to this policy">
        This policy may be updated as posolog evolves, for example if new optional features are
        added. The "last updated" date at the top will always reflect the most recent version.
      </LegalSection>
    </LegalPage>
  );
}
