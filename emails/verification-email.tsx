import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Img,
  Text,
  Button,
  Tailwind,
  pixelBasedPreset,
} from "@react-email/components";

export default function VerificationEmail({
  userEmail,
  verifyUrl,
}: {
  userEmail: string;
  verifyUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email for LibEase</Preview>

      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#111827",
              },
            },
          },
        }}
      >
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-md rounded-xl bg-white px-6 py-8 shadow">
            {/* Logo */}
            <Section className="text-center">
              <Img
                src="https://libease.co.in/logo-main.svg"
                width="120"
                alt="LibEase"
                className="mx-auto"
              />
            </Section>

            {/* Content */}
            <Section className="mt-6">
              <Text className="text-xl font-bold text-gray-900">
                Verify your email 👋
              </Text>

              <Text className="mt-3 text-sm text-gray-700">
                Hi,
              </Text>

              <Text className="text-sm text-gray-700">
                Thanks for signing up with <strong>LibEase</strong>. Please
                confirm your email address:
              </Text>

              <Button
                href={verifyUrl}
                className="mt-5 rounded-lg bg-brand px-4 py-3 text-center text-sm font-medium text-white"
              >
                Verify Email
              </Button>

              <Text className="mt-5 text-xs text-gray-500">
                Or copy and paste this link into your browser:
              </Text>

              <Text className="break-all text-xs text-gray-600">
                {verifyUrl}
              </Text>

              <Text className="mt-6 text-xs text-gray-500">
                This email was sent to {userEmail}. If you didn’t create an
                account, you can safely ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
