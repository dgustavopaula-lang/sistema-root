// ============================================================
// AgroDigital — Vídeo de apresentação (Canvas.mp4)
// ============================================================
// COMO USAR (projeto React/Vite — `npm run dev`):
// 1. Copie o arquivo Canvas.mp4 para a pasta `public/` do projeto
//    e renomeie para `apresentacao.mp4`  →  public/apresentacao.mp4
// 2. Salve este arquivo em `src/components/VideoApresentacao.jsx`
// 3. Na página de login/landing, importe e use:
//      import VideoApresentacao from "./components/VideoApresentacao";
//      ...
//      <VideoApresentacao />
//
// O vídeo roda em loop, sem som (autoplay só funciona com muted),
// com cantos arredondados e moldura dourada sutil, combinando com
// a identidade verde/dourado do AgroDigital.
// ============================================================

export default function VideoApresentacao() {
  return (
    <div style={styles.wrap}>
      <video
        style={styles.video}
        src="/apresentacao.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-label="Apresentação da plataforma AgroDigital"
      />
      <p style={styles.caption}>Sua fazenda, mais inteligente.</p>
    </div>
  );
}

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "8px",
  },
  video: {
    width: "100%",
    display: "block",
    borderRadius: 16,
    border: "1px solid rgba(217, 164, 65, 0.35)", // dourado sutil
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)",
    background: "#0B1A12", // verde-escuro da marca
  },
  caption: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    color: "#6FBE8D", // verde-claro da marca
    letterSpacing: "0.02em",
  },
};

/* ============================================================
   VERSÃO HTML PURO (se a página não for React):
   cole dentro do <body> onde o vídeo deve aparecer.

   <div style="max-width:720px;margin:0 auto;padding:8px">
     <video src="/apresentacao.mp4" autoplay muted loop playsinline
       style="width:100%;display:block;border-radius:16px;
              border:1px solid rgba(217,164,65,.35);
              box-shadow:0 20px 60px rgba(0,0,0,.45);
              background:#0B1A12"
       aria-label="Apresentação da plataforma AgroDigital"></video>
     <p style="text-align:center;margin-top:12px;font-size:14px;
               color:#6FBE8D;letter-spacing:.02em">
       Sua fazenda, mais inteligente.
     </p>
   </div>
   ============================================================ */
