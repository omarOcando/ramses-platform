import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendApprovalEmail = async (to, date, start, end) => {
  const transporter = createTransporter();

  // Convertimos la fecha a string YYYY-MM-DD
  const dateStr = new Date(date).toISOString().split("T")[0];

  // Formato para Google Calendar
  const calendarDate = dateStr.replaceAll("-", "");
  const startTime = start.replace(":", "") + "00";
  const endTime = end.replace(":", "") + "00";

  await transporter.sendMail({
    from: `"Ramses Viloria" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Coaching Session with Ramsés Viloria is Confirmed",
    html: `
      <h2>Your session has been approved</h2>

      <p>Your coaching session has been confirmed.</p>

      <p><strong>Date:</strong> ${dateStr}</p>
      <p><strong>Time:</strong> ${start} - ${end}</p>

      <p>Looking forward to meeting you.</p>

      <p>Ramsés Viloria</p>

      <br/>

      <a 
        href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Coaching+Session+with+Ramses+Viloria&dates=${calendarDate}T${startTime}/${calendarDate}T${endTime}&details=Relationship+Coaching+Session&location=Online"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#c8a95b;
          color:white;
          text-decoration:none;
          border-radius:6px;
          font-weight:bold;
        "
      >
        Add to Google Calendar
      </a>
    `,
  });
};

export const sendCancellationEmail = async (to) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Ramses Viloria" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Coaching Session Request",
    html: `
      <h2>Session Update</h2>
      <p>Unfortunately your requested session could not be confirmed.</p>
      <p>Please book another available time slot.</p>
      <p>Ramsés Viloria</p>
    `,
  });
};

export const notifyAdminNewBooking = async (userEmail, date, start, end) => {
  const transporter = createTransporter();

  const dateStr = new Date(date).toISOString().split("T")[0];

  await transporter.sendMail({
    from: `"Ramses Platform" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New Coaching Session Request",
    html: `
      <h2>New booking request</h2>

      <p>A new session has been requested.</p>

      <p><strong>Client:</strong> ${userEmail}</p>
      <p><strong>Date:</strong> ${dateStr}</p>
      <p><strong>Time:</strong> ${start} - ${end}</p>

      <p>Please log in to approve or cancel the appointment.</p>
    `,
  });
};