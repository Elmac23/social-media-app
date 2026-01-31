import React from "react";
import Typography from "@/components/ui/Typography";

export const metadata = {
  title: "Cookie Policy — Friendsy",
};

export default function CookiesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <Typography as="h1" size="2xl" bold className="mb-4">
        Cookie Policy
      </Typography>
      <Typography className="mb-4">
        This Cookie Policy explains which cookies we use on Friendsy, why we use
        them and how you can manage them.
      </Typography>

      <Typography as="h2" size="lg" bold className="mt-6 mb-2">
        1. What are cookies?
      </Typography>
      <Typography className="mb-4">
        Cookies are small text files stored by your browser on your device. They
        allow the site to recognize your device and remember preferences to
        improve your experience.
      </Typography>

      <Typography as="h2" size="lg" bold className="mt-6 mb-2">
        2. Which cookies do we use?
      </Typography>
      <ul className="list-disc pl-6 mb-4">
        <li>
          <Typography as="span" bold>
            Strictly necessary:
          </Typography>{" "}
          <Typography as="span">
            required for basic site functionality (e.g. authentication,
            sessions).
          </Typography>
        </li>
        <li>
          <Typography as="span" bold>
            Analytics:
          </Typography>{" "}
          <Typography as="span">
            help us understand how users interact with the site (e.g. Google
            Analytics). Data is usually anonymized.
          </Typography>
        </li>
        <li>
          <Typography as="span" bold>
            Functional:
          </Typography>{" "}
          <Typography as="span">
            remember settings and preferences (e.g. language, layout).
          </Typography>
        </li>
        <li>
          <Typography as="span" bold>
            Marketing:
          </Typography>{" "}
          <Typography as="span">
            used for personalization and advertising.
          </Typography>
        </li>
      </ul>

      <Typography as="h2" size="lg" bold className="mt-6 mb-2">
        3. Managing cookies
      </Typography>
      <Typography className="mb-4">
        Most browsers let you manage cookies — you can remove or block them.
        Disabling cookies may reduce the functionality of the site.
      </Typography>

      <Typography as="h2" size="lg" bold className="mt-6 mb-2">
        4. Changes to this policy
      </Typography>
      <Typography className="mb-4">
        We may update this policy from time to time. Any changes will be
        published on this page with the effective date.
      </Typography>

      <Typography as="p" size="sm" color="muted" className="mt-8">
        Last updated: 2025-11-01
      </Typography>
    </main>
  );
}
