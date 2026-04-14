const DRAW_ENDPOINT = "/api/draw";

const participantsInput = document.getElementById("participantsInput");
const csvInput = document.getElementById("csvInput");
const loadCsvBtn = document.getElementById("loadCsvBtn");
const drawBtn = document.getElementById("drawBtn");
const participantsInfo = document.getElementById("participantsInfo");
const resultElement = document.getElementById("result");
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

let currentRotation = 0;
let isSpinning = false;

function parseParticipantsFromText(rawText) {
  const candidates = rawText
    .split(/\r?\n|,|;/g)
    .map((name) => name.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return [...new Set(candidates)];
}

function getParticipants() {
  return parseParticipantsFromText(participantsInput.value);
}

function updateParticipantsInfo() {
  const participants = getParticipants();
  participantsInfo.textContent = `${participants.length} participantes válidos`;
  return participants;
}

function colorForSlice(index) {
  const palette = [
    "#22d3ee",
    "#a78bfa",
    "#f59e0b",
    "#34d399",
    "#fb7185",
    "#f97316",
    "#60a5fa",
    "#c084fc"
  ];
  return palette[index % palette.length];
}

function drawWheel(participants) {
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 16;

  ctx.clearRect(0, 0, size, size);

  if (participants.length === 0) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Adicione participantes", center, center);
    return;
  }

  const anglePerSlice = (Math.PI * 2) / participants.length;

  participants.forEach((name, index) => {
    const startAngle = currentRotation + index * anglePerSlice;
    const endAngle = startAngle + anglePerSlice;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colorForSlice(index);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#0f172a";
    ctx.stroke();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(startAngle + anglePerSlice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#020617";
    ctx.font = "bold 14px Arial";

    const shortName =
      name.length > 18 ? `${name.slice(0, 16).trimEnd()}...` : name;
    ctx.fillText(shortName, radius - 18, 4);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(center, center, 30, 0, Math.PI * 2);
  ctx.fillStyle = "#0b1220";
  ctx.fill();
  ctx.strokeStyle = "#475569";
  ctx.stroke();
}

function readUploadedFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    reader.readAsText(file, "utf-8");
  });
}

async function importCsvOrTxt() {
  const file = csvInput.files?.[0];
  if (!file) {
    setResult("Selecione um arquivo CSV/TXT para importar.", true);
    return;
  }

  try {
    const text = await readUploadedFile(file);
    const importedNames = parseParticipantsFromText(text);
    participantsInput.value = importedNames.join("\n");
    updateParticipantsInfo();
    drawWheel(importedNames);
    setResult(`Importados ${importedNames.length} participantes.`, false);
  } catch (error) {
    setResult(error.message || "Erro ao importar arquivo.", true);
  }
}

function setResult(message, isError) {
  resultElement.textContent = message;
  resultElement.classList.toggle("error", Boolean(isError));
}

function animateToWinner(participants, winnerIndex) {
  return new Promise((resolve) => {
    const total = participants.length;
    const anglePerSlice = (Math.PI * 2) / total;
    const winnerCenter = winnerIndex * anglePerSlice + anglePerSlice / 2;
    const pointerAngle = -Math.PI / 2;
    const targetRaw = pointerAngle - winnerCenter;
    const extraTurns = Math.PI * 2 * 6;
    const start = currentRotation;
    const end = start + extraTurns + (targetRaw - (start % (Math.PI * 2)));
    const durationMs = 4500;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      currentRotation = start + (end - start) * eased;
      drawWheel(participants);

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(tick);
  });
}

async function performDraw() {
  if (isSpinning) {
    return;
  }

  const participants = updateParticipantsInfo();
  if (participants.length < 2) {
    setResult("Informe pelo menos 2 participantes.", true);
    return;
  }

  try {
    isSpinning = true;
    drawBtn.disabled = true;
    setResult("Realizando sorteio...", false);

    const response = await fetch(DRAW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participants })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || "Erro ao sortear.");
    }

    const payload = await response.json();
    await animateToWinner(participants, payload.winnerIndex);

    setResult(
      `Vencedor: ${payload.winner} | Sorteio #${payload.drawId.slice(0, 8)}`,
      false
    );
  } catch (error) {
    setResult(error.message || "Não foi possível concluir o sorteio.", true);
  } finally {
    isSpinning = false;
    drawBtn.disabled = false;
  }
}

participantsInput.addEventListener("input", () => {
  const participants = updateParticipantsInfo();
  drawWheel(participants);
});

loadCsvBtn.addEventListener("click", importCsvOrTxt);
drawBtn.addEventListener("click", performDraw);

updateParticipantsInfo();
drawWheel([]);
