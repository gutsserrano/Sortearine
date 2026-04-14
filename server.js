const express = require("express");
const path = require("path");
const { normalizeParticipants, drawWinner } = require("./api/_lib/draw");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_, res) => {
  return res.status(200).json({ ok: true, service: "sortearine-api" });
});

app.post("/api/draw", (req, res) => {
  try {
    const participants = normalizeParticipants(req.body?.participants);

    if (participants.length < 2) {
      return res.status(400).json({
        error: "invalid_participants",
        message: "Informe pelo menos 2 participantes válidos."
      });
    }

    const draw = drawWinner(participants);
    return res.status(200).json({
      ...draw,
      participantsCount: participants.length
    });
  } catch (error) {
    return res.status(500).json({
      error: "internal_error",
      message: "Não foi possível concluir o sorteio."
    });
  }
});

app.get("*", (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Sortearine local em http://localhost:${PORT}`);
});
