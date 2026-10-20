const input = document.getElementById("guess-input");
const checkButton = document.getElementById("check-button");
const newGameButton = document.getElementById("new-game-button");
const message = document.getElementById("message");
const attempts = document.getElementById("attempts");
const historyList = document.getElementById("history");

let secret = "";
let history = [];

function generateNumber() {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let result = "";

  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * digits.length);
    result += digits[index];
    digits.splice(index, 1);
  }

  return result;
}

function validateInput(value) {
  if (!/^[0-9]+$/.test(value)) {
    return "Введите только цифры";
  }
  if (value.length !== 4) {
    return "Нужно ввести ровно 4 цифры";
  }
  if (new Set(value).size !== 4) {
    return "Все цифры должны быть разными";
  }
  return "";
}

function countBullsAndCows(secretNumber, guess) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < 4; i++) {
    if (guess[i] === secretNumber[i]) {
      bulls++;
    } else if (secretNumber.includes(guess[i])) {
      cows++;
    }
  }

  return { bulls: bulls, cows: cows };
}

function plural(number, one, few, many) {
  const lastTwo = number % 100;
  const last = number % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return many;
  }
  if (last === 1) {
    return one;
  }
  if (last >= 2 && last <= 4) {
    return few;
  }
  return many;
}

function createHistoryItem(attempt) {
  const li = document.createElement("li");
  const bullsText = attempt.bulls + " " + plural(attempt.bulls, "бык", "быка", "быков");
  const cowsText = attempt.cows + " " + plural(attempt.cows, "корова", "коровы", "коров");
  li.textContent = attempt.guess + " → " + bullsText + ", " + cowsText;
  return li;
}

function render() {
  historyList.innerHTML = "";

  const items = history.map(createHistoryItem);
  items.forEach(function (item) {
    historyList.append(item);
  });

  attempts.textContent = "Попыток: " + history.length;
}

function showMessage(text) {
  message.textContent = text;
}

function setGameActive(isActive) {
  input.disabled = !isActive;
  checkButton.disabled = !isActive;
}

function startNewGame() {
  secret = generateNumber();
  history = [];
  input.value = "";
  showMessage("");
  setGameActive(true);
  render();
  input.focus();
}

function checkGuess() {
  const guess = input.value.trim();
  const error = validateInput(guess);

  if (error !== "") {
    showMessage(error);
    return;
  }

  const result = countBullsAndCows(secret, guess);
  history.push({ guess: guess, bulls: result.bulls, cows: result.cows });
  input.value = "";
  showMessage("");
  render();

  if (result.bulls === 4) {
    showMessage("Победа! Угадано за " + history.length + " " + plural(history.length, "попытку", "попытки", "попыток"));
    setGameActive(false);
  }
}

checkButton.addEventListener("click", checkGuess);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkGuess();
  }
});

newGameButton.addEventListener("click", startNewGame);

startNewGame();
