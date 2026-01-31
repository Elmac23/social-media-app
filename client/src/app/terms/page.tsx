import React from "react";
import Typography from "@/components/ui/Typography";

export const metadata = {
  title: "Terms of Service — Friendsy",
};

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <Typography as="h1" size="2xl" bold className="mb-4">
        Terms of Service
      </Typography>

      <Typography className="mb-4">
        Welcome to Friendsy. By using our service you agree to these Terms of
        Service. Please read them carefully.
      </Typography>

      <Typography as="h2" size="lg" bold className="mt-6 mb-2">
        1. Service scope
      </Typography>
      <Typography className="mb-4">
        The service enables profile creation, content posting, messaging and
        other social features. The scope of services may be extended or limited
        in the future.
      </Typography>

      <Typography as="h2" size="lg" bold className="mt-6 mb-2">
        2. Registration and account
      </Typography>
      <Typography className="mb-4">
        Users must provide accurate information during registration and keep
        their password secure. Accounts may be suspended or removed for
        violations of these terms.
      </Typography>

      <Typography as="h2" size="lg" bold className="mt-6 mb-2">
        3. Content rules
      </Typography>
      <Typography className="mb-4">
        Posting content that violates the law, third-party rights, or that is
        abusive, pornographic or promotes violence is prohibited. Content may be
        removed and accounts penalized for violations.
      </Typography>

      <Typography as="h2" size="lg" bold className="mt-6 mb-2">
        4. Liability
      </Typography>
      <Typography className="mb-4">
        The service is not responsible for user-generated content. We respond to
        reports of violations and cooperate with competent authorities when
        required.
      </Typography>

      <Typography as="h2" size="lg" bold className="mt-6 mb-2">
        5. Privacy and data
      </Typography>
      <Typography className="mb-4">
        Our Privacy Policy describes how we process personal data. Please review
        it before using the service.
      </Typography>

      <Typography as="h2" size="lg" bold className="mt-6 mb-2">
        6. Changes to the terms
      </Typography>
      <Typography className="mb-4">
        We may modify these terms; changes will be published on this page with
        the date of effect.
      </Typography>

      <Typography as="p" size="sm" color="muted" className="mt-8">
        Last updated: 2025-11-01
      </Typography>
    </main>
  );
}
