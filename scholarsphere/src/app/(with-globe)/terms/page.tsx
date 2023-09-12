import { type Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

import { ScrollArea } from "@/components/ui/scroll-area";

const TERMS_OF_SERVICE = {
  lastUpdated: "Sep 12, 2023",
  sections: {
    "Acceptance of Terms": {
      content: `By accessing or using ${siteConfig.name} (the 'App'), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.`,
    },
    "Use of the App": {
      content:
        "You may use the App for lawful purposes only. You are responsible for your use of the App and any content you submit. You must not engage in any activities that may disrupt the App or violate any applicable laws.",
    },
    "User Accounts": {
      content:
        "To access certain features of the App, you may be required to create a user account. You are responsible for maintaining the security of your account and the information you provide. You must promptly notify us of any unauthorized access or use of your account.",
    },
    "Intellectual Property": {
      content:
        "The App and its content, including but not limited to text, graphics, logos, images, and software, are protected by intellectual property laws. You may not reproduce, distribute, or modify any content from the App without our written consent.",
    },
    "Privacy": {
      content:
        "Your use of the App is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using the App, you consent to the practices described in the Privacy Policy.",
    },
    "Termination": {
      content:
        "We reserve the right to terminate or suspend your access to the App at our discretion, without notice, for any violation of these Terms of Service or for any other reason. Upon termination, your rights to use the App will cease.",
    },
    "Disclaimer of Warranty": {
      content:
        "The App is provided 'as is' and 'as available' without warranties of any kind, either express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.",
    },
    "Limitation of Liability": {
      content:
        "To the extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.",
    },
    "Changes to Terms": {
      content:
        "We may update these Terms of Service from time to time. Any changes will be posted on this page, and your continued use of the App after such changes constitutes your acceptance of the revised terms.",
    },
    "Contact Us": {
      content:
        "If you have any questions or concerns about these Terms of Service, please contact us at [contact email].",
    },
  },
};

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <>
      <header>
        <h1 className="text-xl font-bold">Terms of Service</h1>

        <span>
          Last updated: <i>{TERMS_OF_SERVICE.lastUpdated}</i>
        </span>
      </header>

      <ScrollArea
        className="
          h-[600px]
          rounded-md
          border
          p-4
        "
      >
        {Object.entries(TERMS_OF_SERVICE.sections).map(
          ([title, { content }], index) => (
            <section key={title} className="mb-4">
              <h2 className="text-lg font-bold">{`${index + 1}. ${title}`}</h2>
              <p>{content}</p>
            </section>
          ),
        )}
      </ScrollArea>
    </>
  );
}
