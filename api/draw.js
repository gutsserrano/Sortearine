const { normalizeParticipants, drawWinner } = require("./_lib/draw");

module.exports = function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "method_not_allowed",
      message: "Use o método POST neste endpoint."
    });
  }

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
};
