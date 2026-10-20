const input = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const filterButtons = document.querySelectorAll(".filter");

let tasks = [];
let nextId = 1;
let currentFilter = "all";

function addTask() {
  const text = input.value.trim();

  if (text === "") {
    alert("Введите текст задачи");
    return;
  }

  tasks.push({ id: nextId, text: text, completed: false });
  nextId++;
  input.value = "";
  render();
}

function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
  });
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  render();
}

function getVisibleTasks() {
  return tasks.filter(function (task) {
    if (currentFilter === "active") {
      return !task.completed;
    }
    if (currentFilter === "completed") {
      return task.completed;
    }
    return true;
  });
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task";
  if (task.completed) {
    li.classList.add("completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", function () {
    toggleTask(task.id);
  });

  const text = document.createElement("span");
  text.textContent = task.text;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Удалить";
  deleteButton.addEventListener("click", function () {
    deleteTask(task.id);
  });

  li.append(checkbox, text, deleteButton);
  return li;
}

function render() {
  list.innerHTML = "";

  const elements = getVisibleTasks().map(createTaskElement);
  elements.forEach(function (element) {
    list.append(element);
  });

  const completedCount = tasks.filter(function (task) {
    return task.completed;
  }).length;
  const activeCount = tasks.length - completedCount;
  counter.textContent = "Осталось: " + activeCount + ", Выполнено: " + completedCount;
}

addButton.addEventListener("click", addTask);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(function (item) {
      item.classList.remove("active");
    });
    button.classList.add("active");
    render();
  });
});

render();
