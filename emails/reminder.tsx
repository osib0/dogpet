import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

interface Props {
  name?: string;
  message: string;
}

export default function LibraryReminderEmail({ name, message }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Library Fee Reminder</Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            📚 Library Reminder
          </Heading>

          <Text style={text}>
            Hello {name || "Member"},
          </Text>

          <Text style={text}>
            {message}
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            — LibEase Library<br />
            Please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f8fafc",
  fontFamily: "Inter, Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  padding: "32px",
  borderRadius: "8px",
  maxWidth: "520px",
  margin: "40px auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const heading = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#0f172a",
  marginBottom: "16px",
};

const text = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#334155",
  marginBottom: "12px",
};

const hr = {
  margin: "24px 0",
};

const footer = {
  fontSize: "12px",
  color: "#64748b",
};
