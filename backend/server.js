const crypto = require("crypto");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function sanitizeName(name) {
  return String(name || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeParticipants(rawParticipants) {
  if (!Array.isArray(rawParticipants)) {
    return [];
  }

  const unique = new Set();
  for (const item of rawParticipants) {
    const normalized = sanitizeName(item);
    if (normalized.length > 0) {
      unique.add(normalized);
    }
  }

  return [...unique];
}

function pickSecureRandomIndex(maxExclusive) {
  return crypto.randomInt(0, maxExclusive);
}

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "sortearine-api" });
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

    const winnerIndex = pickSecureRandomIndex(participants.length);
    const winner = participants[winnerIndex];
    const drawId = crypto.randomUUID();

    return res.json({
      drawId,
      winner,
      winnerIndex,
      participantsCount: participants.length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: "internal_error",
      message: "Não foi possível concluir o sorteio."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Sortearine API ativa em http://localhost:${PORT}`);
});
