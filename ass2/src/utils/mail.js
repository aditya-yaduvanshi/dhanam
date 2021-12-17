require("dotenv").config();
const nodemailer = require("nodemailer"),
  {MAIL_USER, MAIL_PASS} = process.env,
  transporter = nodemailer.createTransport({
    service: "hotmail",
    host: "smtp-mail.outlook.com",
    secure: false,
    port: 587,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });

const sendMail = async ({to,name}) => {
  let info = await transporter.sendMail({
    from: MAIL_USER,
    to: to,
    subject: `Welcome ${name} to our team.`,
    text: `Greetings ${name}, 
    We welcome you on signing up to our app.
    Once again, We thankyou and welcome you.
    Regards,
    Team APP`,
    html: `<h1>Greetings ${name},</h1> 
    <p>We welcome you on signing up to our app.</p>
    <p>Once again, We thankyou and welcome you.</p>
    <p>Regards,</p>
    <p>Team <strong>APP</strong></p>`,
  });
  return info;
};

module.exports = {
  sendMail
};
