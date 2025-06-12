// script.js

const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks on page load
window.onload = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTaskToDOM(task));
};

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  const taskObj = {
    text: taskText,
    completed: false,
    createdAt: new Date().toLocaleString()
  };
  addTaskToDOM(taskObj);
  saveTask(taskObj);
  taskInput.value = "";
});

// ENTER key triggers Add Task
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});

function addTaskToDOM(taskObj) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = taskObj.completed;
  checkbox.style.marginRight = "10px";

  const span = document.createElement("span");
  span.textContent = taskObj.text;
  span.style.cursor = "text";
  span.setAttribute("contenteditable", "false");

  const date = document.createElement("small");
  date.textContent = `Created: ${taskObj.createdAt}`;
  date.style.fontSize = "0.75rem";
  date.style.color = "#666";
  date.style.marginTop = "5px";

  const textContainer = document.createElement("div");
  textContainer.appendChild(span);
  textContainer.appendChild(date);

  if (taskObj.completed) {
    span.style.textDecoration = "line-through";
    span.style.color = "gray";
    li.classList.add("completed");
  }

  checkbox.addEventListener("change", () => {
    taskObj.completed = checkbox.checked;
    if (checkbox.checked) {
      span.style.textDecoration = "line-through";
      span.style.color = "gray";
      li.classList.add("completed");
    } else {
      span.style.textDecoration = "none";
      span.style.color = "black";
      li.classList.remove("completed");
    }
    updateTasksInStorage();
  });

  const deleteBtn = document.createElement("span");
  deleteBtn.textContent = "✖";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.color = "red";
  deleteBtn.style.float = "right";

  deleteBtn.addEventListener("click", () => {
    li.remove();
    removeTask(taskObj);
  });

  const editBtn = document.createElement("span");
  editBtn.textContent = "🖉";
  editBtn.title = "Edit task";
  editBtn.style.marginLeft = "10px";
  editBtn.style.cursor = "pointer";
  editBtn.style.color = "#3a86ff";
  editBtn.style.fontWeight = "bold";

  editBtn.addEventListener("click", () => {
    span.setAttribute("contenteditable", "true");
    span.focus();
  });

  span.addEventListener("blur", () => {
    span.setAttribute("contenteditable", "false");
    taskObj.text = span.textContent;
    updateTasksInStorage();
  });

  span.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      span.blur();
    }
  });

  li.appendChild(checkbox);
  li.appendChild(textContainer);
  li.appendChild(deleteBtn);
  li.appendChild(editBtn);
  taskList.appendChild(li);
}

function saveTask(taskObj) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskObj);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(taskToRemove) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== taskToRemove.text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTasksInStorage() {
  const allTasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    const checkbox = li.querySelector("input[type='checkbox']");
    const span = li.querySelector("span");
    const date = li.querySelector("small");
    allTasks.push({
      text: span.textContent,
      completed: checkbox.checked,
      createdAt: date?.textContent.replace("Created: ", "") || new Date().toLocaleString()
    });
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}
