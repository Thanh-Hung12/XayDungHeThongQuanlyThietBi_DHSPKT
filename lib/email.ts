type EmailPayload = {
  to: string;
  subject: string;
  body: string;
};

export async function sendEmail(payload: EmailPayload) {
  console.log("Email stub", payload);
  return { ok: true };
}
