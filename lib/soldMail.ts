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
    <div style="padding20px;font-family:sans-serif;line-height:1.5;font-size:20px;">
    <h2>Congratulations! You have just sold your item.</h2>
    <p>${text}</p>
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

export async function soldEmail(
  item: string,
  to: string,
  photo: string
): Promise<void> {
  await transport.sendMail({
    to,
    from: '"Indie Bubba 👶" <noreply@indiebubba.com>',
    subject: 'Congratulations! You have just sold your item on Indie Bubba!',
    attachments: [
      {
        filename: 'logo.png',
        path: 'https://indiebubba.com/images/logo.png',
        cid: 'uniq-logo.png',
      },
    ],
    html: makeANiceEmail(`
        
        <p>${item}</p>
        <img alt="Item Image" src="${photo}" width="200px">
        `),
  });
}
