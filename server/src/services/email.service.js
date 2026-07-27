import nodemailer from "nodemailer";

const createTransporter = () => {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
};

export const sendEmail = async (param1, param2) => {
  try {
    let toEmail = "";
    let subject = "Wayfarer Travel Notification";
    let bodyHtml = "";

    if (typeof param1 === "object" && param1 !== null) {
      toEmail = param1.to || param1.email;
      subject = param1.subject || subject;
      bodyHtml = param1.html || `<p>${param1.text || "Notification from Wayfarer"}</p>`;
    } else if (typeof param1 === "string") {
      toEmail = param1;
      const details = param2 || {};
      subject = details.subject || `Booking Confirmation - ${details.id || "Wayfarer Trip"}`;
      bodyHtml = details.html || `
        <h2>Your Wayfarer Trip is Confirmed!</h2>
        <p>Thank you for booking with Wayfarer.</p>
        <p><strong>Booking ID:</strong> ${details.id || "N/A"}</p>
        <p><strong>Total Paid:</strong> $${details.total || details.totalPrice || 0}</p>
      `;
    }

    if (!toEmail) {
      console.warn("Email service: No recipient email provided. Skipping.");
      return false;
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.log(`[DEV MODE] Email dispatch simulated to ${toEmail} (${subject})`);
      return true;
    }

    const mailOptions = {
      from: '"Wayfarer Travel" <no-reply@wayfarer.com>',
      to: toEmail,
      subject,
      html: bodyHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Email service dispatch error (non-fatal):", error.message);
    return false;
  }
};
