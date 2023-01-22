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
    <h3 style="font-weight:normal;">Your Indie Bubba item has been Refunded.<h3> 
    <h3 style="font-weight:normal;">${text}</h3>
    <p>If you need further assistance please contact <a href="mailto:help@indiebubba.com">help@indiebubba.com</a></p>
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

export async function refundEmail(
  item: string,
  to: string,
  photo: string,
  amount: number
): Promise<void> {
  const amountTotal = (parseInt(amount) / 100).toFixed(2);

  var mailOptions = {
    to:to,
    from: '"Indie Bubba 👶" <noreply@indiebubba.com>',
    subject: 'Your Indie Bubba item has been refunded!',
    attachments: [
      {
        filename: 'logo.png',
        path: 'https://res.cloudinary.com/ausipome/image/upload/v1673297335/website/logo_qtom17.png',
        cid: 'uniq-logo.png',
      },
    ],
    html: makeANiceEmail(`
        <p>You have been refunded &pound;${amountTotal}</p>
        <p>For item: ${item}</p>
        <p>Please allow 7 working days for the payment to appear in your account.</p>
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
