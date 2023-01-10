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
    <h2>Welcome to Indie Bubba!</h2>
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

export async function welcomeEmail(token: string, to: string): Promise<void> {

  var mailOptions = {
    to,
    from: 'noreply@indiebubba.com',
    subject: 'Welcome to Indie Bubba!',
    attachments: [
      {
        filename: 'logo.png',
        path: 'https://res.cloudinary.com/ausipome/image/upload/v1673297335/website/logo_qtom17.png',
        cid: 'uniq-logo.png',
      },
    ],
    html: makeANiceEmail(`
        
        <p>Please click <a href="${process.env.FRONTEND_URL}/SignIn?token=${token}">here</a> to confirm your email address</p>
        `),
  }

  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});

}
