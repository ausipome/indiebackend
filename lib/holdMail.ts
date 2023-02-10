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
    <h3 style="font-weight:normal;">Your Indie Bubba item has been Received.<h3> 
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

export async function holdEmail(
  item: string,
  to: string,
  photo: string
): Promise<void> {

  var mailOptions = {
    to:to,
    from: '"Indie Bubba 👶" <noreply@indiebubba.com>',
    subject: 'Your Indie Bubba item has been received!',
    attachments: [
      {
        filename: 'logo.png',
        path: 'https://res.cloudinary.com/ausipome/image/upload/v1673297335/website/logo_qtom17.png',
        cid: 'uniq-logo.png',
      },
    ],
    html: makeANiceEmail(`
        <p>Your payment is currently on hold until you update your Indie Bubba account! <br>Please login and update your account. <br>Once your account is up to date, you can release the funds by finding the sold item in your Indie Bubba account, and clicking Release Funds.</p>
        <p>Item: ${item}</p>
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
