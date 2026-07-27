import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: parseInt(process.env.SMTP_PORT || "2525"),
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
};

export const sendBookingConfirmationEmail = async (toEmail, bookingDetails) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: '"Wayfarer Travel" <no-reply@wayfarer.com>',
    to: toEmail,
    subject: `Booking Confirmation - ${bookingDetails.id || "Wayfarer Trip"}`,
    html: `
      <h2>Your Wayfarer Trip is Confirmed!</h2>
      <p>Thank you for booking with Wayfarer.</p>
      <p><strong>Booking ID:</strong> ${bookingDetails.id}</p>
      <p><strong>Total Paid:</strong> $${bookingDetails.total}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
