import { createTransport } from 'nodemailer';

const transport = createTransport({
  host: process.env.NODEMAIL_HOST,
  port: process.env.NODEMAIL_PORT,
  auth: {
    user: process.env.NODEMAIL_USER,
    pass: process.env.NODEMAIL_PASS,
  },
});

function makeANiceEmail(text: string): string {
  return `
  <img style="width:200px" src="cid:uniq-logo.png" alt="Indie Bubba logo" />
    <div style="padding:20px;font-family:sans-serif;line-height:1.5;">
    <h3 style="font-weight:normal;">Your Indie Bubba item issue has been resolved.<h3> 
    <h3 style="font-weight:normal;">${text}</h3>
    <p>Thanks,<br>Indie</p>
    </div>
    `;
}

export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}
export interface Envelope {
  from: string;
  to?: string[] | null;
}

export async function resolvedEmail(
  item: string,
  to: string,
  photo: string,
  amount: number
): Promise<void> {
  const amountTotal = (parseInt(amount) / 100).toFixed(2);

  await transport.sendMail({
    to,
    from: '"Indie Bubba 👶" <noreply@indiebubba.com>',
    subject: 'Your Indie Bubba item issue has been resolved.',
    attachments: [
      {
        filename: 'logo.png',
        path: 'https://indiebubba.com/images/logo.png',
        cid: 'uniq-logo.png',
      },
    ],
    html: makeANiceEmail(`
        <p>You have been paid &pound;${amountTotal}</p>
        <p>Item: ${item}</p>
        <img alt="Item Image" src="${photo}" width="200px">
        `),
  });
}
