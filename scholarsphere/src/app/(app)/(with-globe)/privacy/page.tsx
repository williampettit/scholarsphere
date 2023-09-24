import { type Metadata } from "next";

import { siteConfig } from "@/config/site-config";

import { ScrollArea } from "@/components/ui/scroll-area";

const PRIVACY_POLICY = {
  lastUpdated: "Sep 12, 2023",
  sections: {
    "Information We Collect": {
      content: `At ${siteConfig.name}, we collect the following types of information:\n\n- Personal Information: When you sign up for an account, we may collect your name, email address, and other personal details as needed for your account.\n- Usage Information: We automatically collect information about how you interact with our app, including your IP address, device information, and the actions you take within the app.\n- Cookies and Analytics: We use cookies and similar tracking technologies to analyze user behavior and improve our services.\n\nWe only collect the information necessary to provide and improve our app.`,
    },
    "How We Use Your Information": {
      content:
        "We use the information we collect for the following purposes:\n\n- To provide and maintain our app.\n- To personalize your experience and provide tailored content.\n- To analyze usage patterns and improve our app.\n- To communicate with you about updates, promotions, and other relevant information.\n\nWe do not sell your personal information to third parties.",
    },
    "Data Security": {
      content:
        "We take data security seriously and implement appropriate measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is entirely secure, and we cannot guarantee absolute security.",
    },
    "Your Choices": {
      content:
        "You can control your personal information by:\n\n- Updating your account settings.\n- Unsubscribing from promotional emails.\n- Deleting your account, subject to our data retention policy.\n\nPlease note that some features of the app may not be available without certain information.",
    },
    "Changes to this Privacy Policy": {
      content:
        "We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any updates will be posted on this page, and we encourage you to review this policy periodically.",
    },
    "Contact Us": {
      content:
        "If you have any questions or concerns about our privacy practices or this policy, please contact us.",
    },
  },
};

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <>
      <header>
        <h1 className="text-xl font-bold">Privacy Policy</h1>

        <span>
          Last updated: <i>{PRIVACY_POLICY.lastUpdated}</i>
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
        {Object.entries(PRIVACY_POLICY.sections).map(
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
