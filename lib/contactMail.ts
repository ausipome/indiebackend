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
    <h3 style="font-weight:normal;">You have received the following message through Indie Bubba, with regards to the below item.<h3> 
    <p style="font-weight:normal;">${text}</p>
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

export async function contactEmail(
  item: string,
  to: string,
  photo: string,
  message: string
): Promise<void> {

  var mailOptions = {
    to:to,
    from: '"Indie Bubba 👶" <noreply@indiebubba.com>',
    subject: 'You have received the following message through Indie Bubba!',
    attachments: [
      {
        filename: 'logo.png',
        path: 'https://res.cloudinary.com/ausipome/image/upload/v1673297335/website/logo_qtom17.png',
        cid: 'uniq-logo.png',
      },
    ],
    html: makeANiceEmail(`
        <p style="color:red">${message}</p>
        <p>You can reply by logging in to your account and finding the item purchased</p>
        <p style="text-decoration:underline;">${item}</p>
        <img alt="Item Image" src="https://theimagesofindiebubba.toomanyideas.co.uk/${photo}" width="200px">
        `),
  }

  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});

}
