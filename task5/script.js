const pads = document.querySelectorAll(".pad");
const startButton = document.getElementById("start-button");
const levelText = document.getElementById("level");
const message = document.getElementById("message");

const state = {
  sequence: [],
  playerIndex: 0,
  showing: false,
  playing: false,
};

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

async function flashPad(index) {
  pads[index].classList.add("active");
  await sleep(500);
  pads[index].classList.remove("active");
  await sleep(250);
}

async function showSequence() {
  state.showing = true;
  message.textContent = "Смотрите...";

  for (const index of state.sequence) {
    await flashPad(index);
  }

  state.playerIndex = 0;
  state.showing = false;
  message.textContent = "Ваш ход";
}

function nextRound() {
  const randomIndex = Math.floor(Math.random() * 4);
  state.sequence.push(randomIndex);
  levelText.textContent = "Уровень: " + state.sequence.length;
  showSequence();
}

function startGame() {
  state.sequence = [];
  state.playerIndex = 0;
  state.playing = true;
  startButton.disabled = true;
  nextRound();
}

function endGame() {
  state.playing = false;
  startButton.disabled = false;
  message.textContent = "Вы дошли до уровня " + state.sequence.length;
}

function handlePadClick(index) {
  if (!state.playing || state.showing) {
    return;
  }

  pads[index].classList.add("active");
  setTimeout(function () {
    pads[index].classList.remove("active");
  }, 200);

  if (index !== state.sequence[state.playerIndex]) {
    endGame();
    return;
  }

  state.playerIndex++;

  if (state.playerIndex === state.sequence.length) {
    state.showing = true;
    setTimeout(nextRound, 800);
  }
}

pads.forEach(function (pad, index) {
  pad.addEventListener("click", function () {
    handlePadClick(index);
  });
});

startButton.addEventListener("click", startGame);
