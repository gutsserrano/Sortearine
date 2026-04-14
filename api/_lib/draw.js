const crypto = require("crypto");

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

function drawWinner(participants) {
  const winnerIndex = crypto.randomInt(0, participants.length);
  return {
    winnerIndex,
    winner: participants[winnerIndex],
    drawId: crypto.randomUUID(),
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  normalizeParticipants,
  drawWinner
};
