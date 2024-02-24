const nodemailer = require("nodemailer");

const sendMail = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "",
      pass: "",
    },
  });

  const mailOptions = {
    from: "Tester <abc@gmail.com>", // sender address
    to: "", // list of receivers
    subject: "Warning Email", // Subject line
    html: "<span>Your stock is going to be end</span>", // html body
  };
  try {
    const temp = await transporter.sendMail(mailOptions);
    console.log("email has been sent successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
