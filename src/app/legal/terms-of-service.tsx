import LegalPage, { LegalSection } from "@/components/legal/legal-page";
import {
  Ban,
  ClipboardList,
  Code,
  History,
  Scale,
  Stethoscope,
  TriangleAlert,
} from "lucide-react-native";

const LAST_UPDATED = "August 25, 2026";

const INTRO =
  "These terms cover your use of posolog. By using the app, you agree to them — please read the medical disclaimer below carefully, since it's the most important part.";

export default function TermsOfServiceScreen() {
  return (
    <LegalPage lastUpdated={LAST_UPDATED} intro={INTRO} contactTitle="Questions about these terms?">
      <LegalSection icon={Stethoscope} tone="rose" title="Medical disclaimer">
        posolog is a personal tracking and calculation tool, not a medical device. The
        pharmacokinetic estimates, plasma curves, and other calculations it produces are for
        informational and educational purposes only — they are not medical advice and not a
        substitute for professional judgment. Always consult a licensed physician or pharmacist
        before making any decision about your medication, dosing, or treatment. Never start,
        stop, or change a medication based solely on what this app shows you.
      </LegalSection>

      <LegalSection icon={ClipboardList} tone="sky" title="Your data and responsibility">
        You're responsible for the accuracy of the medication and health data you enter. posolog
        calculates results based on exactly what you input — it doesn't verify accuracy, check
        for drug interactions, or know your medical history. There's no account or login, so
        you're also responsible for keeping your device itself secure, since anyone with access
        to it can view or edit your data.
      </LegalSection>

      <LegalSection icon={TriangleAlert} tone="peach" title="No warranty">
        posolog is provided "as is" and "as available," without warranties of any kind, express
        or implied. We don't guarantee the app will be error-free or uninterrupted, or that its
        calculations will be accurate or appropriate for your specific situation. You use it at
        your own risk.
      </LegalSection>

      <LegalSection icon={Scale} tone="lilac" title="Limitation of liability">
        To the fullest extent permitted by law, the developers of posolog aren't liable for any
        harm, loss, or damages — including health-related harm — arising from your use of the app
        or reliance on the information it provides. posolog is a free, independently developed
        tool and not a certified medical product.
      </LegalSection>

      <LegalSection icon={Code} tone="mint" title="Open source">
        posolog's source code is publicly available at github.com/pawbies/posolog, under the
        license included in that repository. You're welcome to read, audit, or contribute to it.
      </LegalSection>

      <LegalSection icon={History} tone="cream" title="Changes to these terms">
        These terms may be updated as posolog evolves. Continuing to use the app after a change
        means you accept the updated terms — the "last updated" date at the top will always
        reflect the most recent version.
      </LegalSection>

      <LegalSection icon={Ban} tone="rose" title="Ending your use">
        You can stop using posolog and uninstall it at any time. Since there's no account, there's
        nothing further to cancel — deleting the app removes its locally stored data, aside from
        anything already included in a device backup.
      </LegalSection>
    </LegalPage>
  );
}
