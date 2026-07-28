const themeButton = document.getElementById("themeButton");
const startButton = document.getElementById("startButton");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

startButton.addEventListener("click", () => {
  alert("Ótimo! Sua próxima aula é Conversação.");
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (!taskText) {
    return;
  }

  const item = document.createElement("li");
  item.innerHTML = `
    <span>${taskText}</span>
    <button class="delete-button">Excluir</button>
  `;

  taskList.appendChild(item);
  taskInput.value = "";
  taskInput.focus();
});

taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    event.target.closest("li").remove();
  }
});
