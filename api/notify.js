// Vercel Serverless Function — sends Telegram notification for Fab bookings
// Endpoint: POST /api/notify

const FAB_BOT_TOKEN = "8289898756:AAFc6I-BC65qA0hOL_9yjJ-xQS1__19fufU";
const ISAAC_CHAT_ID = "1729085064";
// Fab's chat ID will be added once he /starts the bot
// const FAB_CHAT_ID = "";

async function sendTelegram(chatId, text) {
  await fetch(`https://api.telegram.org/bot${FAB_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { record } = req.body;
    if (!record) {
      return res.status(400).json({ error: "No record" });
    }

    const date = record.preferred_date
      ? new Date(record.preferred_date + "T00:00:00").toLocaleDateString("en-GB", {
          weekday: "short", day: "numeric", month: "short", year: "numeric",
        })
      : "Not specified";

    const msg = `🔔 <b>NEW BOOKING — Fab The Stretch Lad</b>

👤 <b>Name:</b> ${record.name || "—"}
📧 <b>Email:</b> ${record.email || "—"}
📱 <b>Phone:</b> ${record.phone || "—"}
💬 <b>Telegram:</b> ${record.telegram ? "@" + record.telegram : "—"}
📸 <b>Instagram:</b> ${record.instagram ? "@" + record.instagram : "—"}
📅 <b>Date:</b> ${date}
⏰ <b>Time:</b> ${record.preferred_time || "Not specified"}
🎯 <b>Issue Area:</b> ${record.issue_area || "—"}
✏️ <b>Description:</b> ${record.description || "—"}`;

    // Send to Isaac
    await sendTelegram(ISAAC_CHAT_ID, msg);
    
    // TODO: Send to Fab once he activates the bot
    // if (FAB_CHAT_ID) await sendTelegram(FAB_CHAT_ID, msg);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Notify error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
