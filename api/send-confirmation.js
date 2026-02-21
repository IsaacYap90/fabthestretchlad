// Vercel Serverless Function — sends confirmation email for Fab bookings
import nodemailer from "nodemailer";

const API_SECRET = process.env.API_SECRET;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function googleCalendarLink(booking) {
  const date = (booking.preferred_date || "").replace(/-/g, "");
  const time = booking.preferred_time || "";
  const startMatch = time.match(/^(\d{2}):(\d{2})/);
  const endMatch = time.match(/(\d{2}):(\d{2})$/);
  let dtStart = date + "T090000";
  let dtEnd = date + "T100000";
  if (startMatch) dtStart = date + `T${startMatch[1]}${startMatch[2]}00`;
  if (endMatch) dtEnd = date + `T${endMatch[1]}${endMatch[2]}00`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Stretch Session with Fab — The Stretch Lad",
    dates: `${dtStart}/${dtEnd}`,
    details: `Issue Area: ${booking.issue_area || "General"}\n${booking.description || ""}`,
    location: "Singapore (Mobile — Fab comes to you)",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function generateICSContent(booking) {
  const date = (booking.preferred_date || "").replace(/-/g, "");
  const time = booking.preferred_time || "";
  const startMatch = time.match(/^(\d{2}):(\d{2})/);
  const endMatch = time.match(/(\d{2}):(\d{2})$/);
  let dtStart = date + "T090000";
  let dtEnd = date + "T100000";
  if (startMatch) dtStart = date + `T${startMatch[1]}${startMatch[2]}00`;
  if (endMatch) dtEnd = date + `T${endMatch[1]}${endMatch[2]}00`;

  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FabTheStretchLad//Booking//EN",
    "BEGIN:VEVENT", `UID:${booking.id || Date.now()}@fabthestretchlad.com`,
    `DTSTART:${dtStart}`, `DTEND:${dtEnd}`,
    "SUMMARY:Stretch Session with Fab — The Stretch Lad",
    "LOCATION:Singapore (Mobile)",
    `DESCRIPTION:Issue: ${booking.issue_area || "General"}\\n${(booking.description || "").replace(/\n/g, "\\n")}`,
    "STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Verify request authenticity
  if (API_SECRET && req.headers["x-api-secret"] !== API_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const booking = req.body;
    if (!booking.email) return res.status(400).json({ error: "No email" });

    const refId = (booking.id || "").substring(0, 8).toUpperCase() || "PENDING";
    const dateFormatted = booking.preferred_date
      ? new Date(booking.preferred_date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : "To be confirmed";
    const gcalLink = googleCalendarLink(booking);

    const safeName = escapeHtml(booking.name);
    const safeTime = escapeHtml(booking.preferred_time) || "To be confirmed";
    const safeIssue = escapeHtml(booking.issue_area) || "General";
    const safeDesc = escapeHtml(booking.description) || "—";
    const safeDateFormatted = escapeHtml(dateFormatted);

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);">
    <!-- Header -->
    <div style="background:#dc2626;padding:32px 24px;text-align:center;">
      <h1 style="color:#fff;margin:8px 0 0;font-size:28px;font-weight:900;">FAB</h1>
      <p style="color:rgba(255,255,255,0.7);margin:2px 0 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;">The Stretch Lad</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 24px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h2 style="color:#fff;margin:0 0 8px;font-size:24px;">Booking Received!</h2>
        <p style="color:#a3a3a3;margin:0;font-size:14px;">Reference: <strong style="color:#dc2626;">#${escapeHtml(refId)}</strong></p>
      </div>

      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#a3a3a3;font-size:13px;width:120px;">Name</td><td style="padding:8px 0;color:#fff;font-size:14px;font-weight:600;">${safeName}</td></tr>
          <tr><td style="padding:8px 0;color:#a3a3a3;font-size:13px;">Date</td><td style="padding:8px 0;color:#fff;font-size:14px;font-weight:600;">${safeDateFormatted}</td></tr>
          <tr><td style="padding:8px 0;color:#a3a3a3;font-size:13px;">Time</td><td style="padding:8px 0;color:#fff;font-size:14px;font-weight:600;">${safeTime}</td></tr>
          <tr><td style="padding:8px 0;color:#a3a3a3;font-size:13px;">Location</td><td style="padding:8px 0;color:#fff;font-size:14px;font-weight:600;">Singapore (Mobile)</td></tr>
          <tr><td style="padding:8px 0;color:#a3a3a3;font-size:13px;">Issue Area</td><td style="padding:8px 0;color:#fff;font-size:14px;">${safeIssue}</td></tr>
          <tr><td style="padding:8px 0;color:#a3a3a3;font-size:13px;">Details</td><td style="padding:8px 0;color:#fff;font-size:14px;">${safeDesc}</td></tr>
        </table>
      </div>

      <p style="color:#a3a3a3;font-size:14px;text-align:center;margin-bottom:24px;">
        Fab will get back to you within <strong style="color:#fff;">24 hours</strong> to confirm your session.
      </p>

      <div style="text-align:center;">
        <a href="${gcalLink}" target="_blank" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 24px;border-radius:24px;text-decoration:none;font-size:14px;font-weight:700;">
          Add to Google Calendar
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid rgba(255,255,255,0.1);padding:20px 24px;text-align:center;">
      <p style="color:#525252;font-size:12px;margin:0;">
        Fab The Stretch Lad — <a href="https://fabthestretchlad.com" style="color:#dc2626;text-decoration:none;">fabthestretchlad.com</a>
      </p>
    </div>
  </div>
</div>
</body>
</html>`;

    const icsContent = generateICSContent(booking);

    await transporter.sendMail({
      from: '"Fab The Stretch Lad" <hello@isaacyap.ai>',
      to: booking.email,
      subject: `Booking Received — Fab The Stretch Lad #${escapeHtml(refId)}`,
      html,
      icalEvent: { method: "REQUEST", content: icsContent },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
