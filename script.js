(() => {
  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");

  if (!form || !input || !list) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = input.value.trim();
    if (!value) return;

    const taskEl = createTaskElement(value);
    list.insertBefore(taskEl, list.firstChild);
    reorderTasks();

    input.value = "";
    input.focus();
  });

  function createTaskElement(text) {
    const li = document.createElement("li");
    li.className = "task task--anim-enter";
    li.setAttribute("data-done", "false");
    li.setAttribute("data-starred", "false");

    const content = document.createElement("div");
    content.className = "task__content";

    const checkbox = document.createElement("button");
    checkbox.type = "button";
    checkbox.className = "task__checkbox";
    checkbox.setAttribute("aria-label", "Mark task as done");

    const checkboxIcon = document.createElement("span");
    checkboxIcon.className = "task__checkbox-icon";
    checkbox.appendChild(checkboxIcon);

    const textSpan = document.createElement("span");
    textSpan.className = "task__text";
    textSpan.textContent = text;

    content.appendChild(checkbox);
    content.appendChild(textSpan);

    const actions = document.createElement("div");
    actions.className = "task__actions";

    const starBtn = document.createElement("button");
    starBtn.type = "button";
    starBtn.className = "task__btn task__btn--star";
    starBtn.textContent = "☆";
    starBtn.title = "Star task";
    starBtn.setAttribute("aria-label", "Star task");
    starBtn.setAttribute("aria-pressed", "false");

    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "task__btn";
    upBtn.textContent = "↑";
    upBtn.title = "Move up";

    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "task__btn";
    downBtn.textContent = "↓";
    downBtn.title = "Move down";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "task__btn task__btn--danger";
    deleteBtn.textContent = "✕";
    deleteBtn.title = "Remove task";

    actions.appendChild(starBtn);
    actions.appendChild(upBtn);
    actions.appendChild(downBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(content);
    li.appendChild(actions);

    checkbox.addEventListener("click", () => toggleDone(li));
    starBtn.addEventListener("click", () => toggleStar(li, starBtn));
    upBtn.addEventListener("click", () => moveTask(li, "up"));
    downBtn.addEventListener("click", () => moveTask(li, "down"));
    deleteBtn.addEventListener("click", () => removeTask(li));

    setTimeout(() => {
      li.classList.remove("task--anim-enter");
    }, 180);

    return li;
  }

  function toggleDone(taskEl) {
    const done = taskEl.getAttribute("data-done") === "true";
    const newValue = (!done).toString();
    taskEl.setAttribute("data-done", newValue);
    taskEl.classList.toggle("task--done", !done);
    reorderTasks();
  }

  function toggleStar(taskEl, starBtn) {
    const starred = taskEl.getAttribute("data-starred") === "true";
    const nowStarred = !starred;

    taskEl.setAttribute("data-starred", nowStarred.toString());
    taskEl.classList.toggle("task--starred", nowStarred);

    starBtn.textContent = nowStarred ? "★" : "☆";
    starBtn.setAttribute("aria-pressed", nowStarred.toString());
    starBtn.setAttribute("aria-label", nowStarred ? "Unstar task" : "Star task");

    reorderTasks();
  }

  function moveTask(taskEl, direction) {
    if (taskEl.parentElement !== list) return;

    const sibling =
      direction === "up" ? taskEl.previousElementSibling : taskEl.nextElementSibling;

    if (!sibling) return;

    if (direction === "up") {
      list.insertBefore(taskEl, sibling);
    } else {
      list.insertBefore(sibling, taskEl);
    }
  }

  function reorderTasks() {
    const tasks = Array.from(list.children);

    tasks.sort((a, b) => {
      const aDone = a.getAttribute("data-done") === "true";
      const bDone = b.getAttribute("data-done") === "true";

      // Incomplete tasks before completed tasks
      if (aDone !== bDone) {
        return aDone ? 1 : -1;
      }

      const aStar = a.getAttribute("data-starred") === "true";
      const bStar = b.getAttribute("data-starred") === "true";

      // Within same done state, starred tasks first
      if (aStar !== bStar) {
        return aStar ? -1 : 1;
      }

      // Otherwise keep current relative order (stable sort)
      return 0;
    });

    tasks.forEach((task) => list.appendChild(task));
  }

  function removeTask(taskEl) {
    taskEl.classList.add("task--anim-exit");
    const duration = 150;
    setTimeout(() => {
      if (taskEl.parentElement === list) {
        list.removeChild(taskEl);
      }
    }, duration);
  }
})();

