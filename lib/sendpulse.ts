let token: string | null = null;

async function getToken() {
  if (token) return token;

  const res = await fetch("https://api.sendpulse.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.SENDPULSE_API_ID,
      client_secret: process.env.SENDPULSE_API_SECRET,
    }),
  });

  const data = await res.json();
  token = data.access_token;
  return token;
}

export async function sendEmail(to: string, subject: string, html: string) {
  const accessToken = await getToken();

  const res = await fetch("https://api.sendpulse.com/smtp/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      email: {
        subject,
        html,
        from: {
          name: "LibEase",
          email: "mohammadosib06@gmmail.com" 
        },
        to: [{ email: to }],
      },
    }),
  });

  return res.json();
}
