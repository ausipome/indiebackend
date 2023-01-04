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
    <div style="border:1px solid black;padding20px;font-family:sans-serif;line-height:2;font-size:20px;">
    <h2>Hello There!</h2>
    <p>${text}</p>
    <p>Martyn</p>
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

export async function sendEmail(to: string): Promise<void> {
  await transport.sendMail({
    to,
    from: 'hello@indiebubba.com',
    subject: 'Hello This is a test!',
    html: makeANiceEmail(`Your lovely email is here!
        
        <a href="hello.com">Click here to Say hello</a>
        `),
  });
}
