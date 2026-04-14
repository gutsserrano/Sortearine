module.exports = function handler(_, res) {
  return res.status(200).json({ ok: true, service: "sortearine-api" });
};
