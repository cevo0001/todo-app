// ------------ MODEL (data + localStorage) ------------

// Vores task-array (MODEL)
let tasks = [];

// Hent fra localStorage når siden loader
const saved = localStorage.getItem("tasks");
if (saved) {
  tasks = JSON.parse(saved);
}

// Hjælpefunktion til at gemme
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ------------ VIEW (DOM referencer + rendering) ------------

const form = document.getElementById("task-form");
const inputText = document.getElementById("task-text");
const inputAmount = document.getElementById("task-amount");
const feedback = document.getElementById("feedback");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");

// Vis feedback til brugeren
function showFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = "feedback"; // reset classes

  if (type) {
    feedback.classList.add(type);
  }

  // Gør at beskeden forsvinder igen efter lidt tid (valgfrit)
  if (message) {
    setTimeout(() => {
      feedback.textContent = "";
      feedback.className = "feedback";
    }, 2500);
  }
}

// Render alle tasks i DOM (VIEW afspejler MODEL)
function renderTasks() {
  // Tøm lister først
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  // Sorter evt. så de nyeste kommer øverst
  const sortedTasks = [...tasks].sort((a, b) => b.id - a.id);

  sortedTasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    if (task.done) li.classList.add("done");

    li.innerHTML = `
      <div class="task-main">
        <span class="task-title">${task.text}</span>
        <span class="task-meta">Antal: ${task.amount}</span>
      </div>
      <div class="task-actions"></div>
    `;

    const actions = li.querySelector(".task-actions");

    if (task.done) {
      // Knappen til at fortryde færdig
      const undoBtn = document.createElement("button");
      undoBtn.textContent = "Fortryd";
      undoBtn.className = "btn secondary";
      undoBtn.addEventListener("click", () => toggleDone(task.id));
      actions.appendChild(undoBtn);
    } else {
      // Knappen til at markere færdig
      const doneBtn = document.createElement("button");
      doneBtn.textContent = "Færdig";
      doneBtn.className = "btn secondary";
      doneBtn.addEventListener("click", () => toggleDone(task.id));
      actions.appendChild(doneBtn);
    }

    // Delete-knap
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Slet";
    deleteBtn.className = "btn danger";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));
    actions.appendChild(deleteBtn);

    // Læg i den rigtige liste
    if (task.done) {
      doneList.appendChild(li);
    } else {
      todoList.appendChild(li);
    }
  });
}

// ------------ CONTROLLER (events + logik) ------------

// Tilføj ny task
function handleAddTask(event) {
  event.preventDefault();

  const text = inputText.value.trim();
  const amount = Number(inputAmount.value);

  if (!text) {
    showFeedback("Skriv hvad du skal gøre/købe ✏️", "error");
    return;
  }

  if (!amount || amount < 1) {
    showFeedback("Angiv et antal på mindst 1 🧮", "error");
    return;
  }

  const newTask = {
    id: Date.now(), // simpelt unikt ID
    text,
    amount,
    done: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  showFeedback("Opgaven blev tilføjet ✔️", "success");

  form.reset();
  inputAmount.value = 1; // sæt tilbage til 1
  inputText.focus();
}

// Skift done/ikke-done
function toggleDone(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  saveTasks();
  renderTasks();
}

// Slet task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
  showFeedback("Opgaven blev slettet 🗑️", "success");
}

// Event listeners (VIEW sender input til CONTROLLER)
form.addEventListener("submit", handleAddTask);

// Første render når siden loader (VIEW viser MODEL)
renderTasks();
