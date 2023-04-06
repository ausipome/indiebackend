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
    <h3 style="font-weight:normal;">Your Indie Bubba item has been posted.<h3> 
    <p style="font-weight:normal;">When you receive your item, please mark the item as received in your Indie Bubba account.
    <br>This ensures the seller gets paid on time and keeps our community rolling.
    <br><br>If there is an issue with the item, please raise the issue in your Indie Bubba account.</p>
    <h3>${text}</h3>
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

export async function postedEmail(
  item: string,
  to: string,
  photo: string
): Promise<void> {

  var mailOptions = {
    to:to,
    from: '"Indie Bubba 👶" <noreply@indiebubba.com>',
    subject: 'Your Indie Bubba item has been posted!',
    attachments: [
      {
        filename: 'logo.png',
        path: 'https://res.cloudinary.com/ausipome/image/upload/v1673297335/website/logo_qtom17.png',
        cid: 'uniq-logo.png',
      },
    ],
    html: makeANiceEmail(`
        
        <p>Item: ${item}</p>
        <img alt="Item Image" src="https://toomanyideas.co.uk/${photo}" width="200px">
        `),
  }

  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});

}
