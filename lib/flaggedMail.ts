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
    <h3 style="font-weight:normal;">An issue has been raised with your Indie Bubba item!<h3> 
    <p style="font-weight:normal;">Payment will be withheld until the issue is resolved. 
    <br>The buyer will contact you through the Indie Bubba messaging system.
    <br><br>If they fail to do that, please contact them via the Indie Bubba messaging system. 
    <br>To do this, find the item, in the sold items tab in your Indie Bubba account and click Contact Buyer.</p>
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

export async function flaggedEmail(
  item: string,
  to: string,
  photo: string
): Promise<void> {

  var mailOptions = {
    to:to,
    from: '"Indie Bubba 👶" <noreply@indiebubba.com>',
    subject: 'An issue has been raised with your Indie Bubba item!',
    attachments: [
      {
        filename: 'logo.png',
        path: 'https://res.cloudinary.com/ausipome/image/upload/v1673297335/website/logo_qtom17.png',
        cid: 'uniq-logo.png',
      },
    ],
    html: makeANiceEmail(`
        
        <p>Item: ${item}</p>
        <img alt="Item Image" src="${photo}" width="200px">
        `),
  }
  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});
}
