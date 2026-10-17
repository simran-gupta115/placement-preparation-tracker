// 1. Select HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskDeadline = document.getElementById("taskDeadline");
const taskPriority = document.getElementById("taskPriority");
const taskCategory = document.getElementById("taskCategory");

// 2. Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// 3. Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 4. Update statistics and progress bar
function updateProgress() {
    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    document.getElementById("progressText").textContent =
        percentage + "%";

    document.getElementById("progressFill").style.width =
        percentage + "%";
}

// 5. Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent =
    task.text +
    " (" + (task.category || "Other") + ")" +
    " | Priority: " + (task.priority || "Medium") +
    " | Deadline: " + (task.deadline || "Not set");

        if (task.completed) {
            span.style.textDecoration = "line-through";
            span.style.color = "green";
        }

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Complete";

        completeBtn.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;

            saveTasks();
            displayTasks();
        });
        const editBtn = document.createElement("button");
editBtn.textContent = "Edit";

editBtn.addEventListener("click", function() {
    const newText = prompt("Enter updated task:", task.text);

    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks();
        displayTasks();
    }
});

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function () {
            tasks.splice(index, 1);

            saveTasks();
            displayTasks();
        });

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateProgress();
    updateUpcomingDeadlines();
}

// 6. Add task
addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
    text: taskText,
    category: taskCategory.value,
    deadline: taskDeadline.value,
    priority: taskPriority.value,
    completed: false

    });

    saveTasks();
    displayTasks();

    taskInput.value = "";
});

// 7. Display saved tasks on page load
displayTasks();
function filterTasks(filter) {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (filter === "completed") {
        filteredTasks = tasks.filter(function(task) {
            return task.completed === true;
        });
    } else if (filter === "pending") {
        filteredTasks = tasks.filter(function(task) {
            return task.completed === false;
        });
    }

    filteredTasks.forEach(function(task) {
        const index = tasks.indexOf(task);

        const li = document.createElement("li");
        const span = document.createElement("span");

        span.textContent =
    task.text +
    " (" + (task.category || "Other") + ")" +
    " | Priority: " + (task.priority || "Medium") +
    " | Deadline: " + (task.deadline || "Not set");

        if (task.completed) {
            span.style.textDecoration = "line-through";
            span.style.color = "green";
        }

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Complete";

        completeBtn.addEventListener("click", function() {
            tasks[index].completed = !tasks[index].completed;
            if (tasks[index].completed) {
    tasks[index].completedDate = new Date().toDateString();
} else {
    delete tasks[index].completedDate;
}
            saveTasks();
            displayTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.appendChild(span);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}
function filterByCategory() {
    const selectedCategory = document.getElementById("categoryFilter").value;

    taskList.innerHTML = "";

    const filteredTasks = selectedCategory === "all"
        ? tasks
        : tasks.filter(function(task) {
            return (task.category || "Other") === selectedCategory;
        });

    filteredTasks.forEach(function(task) {
        const index = tasks.indexOf(task);

        const li = document.createElement("li");
        const span = document.createElement("span");

        span.textContent = task.text + " (" + (task.category || "Other") + ")";

        if (task.completed) {
            span.style.textDecoration = "line-through";
            span.style.color = "green";
        }

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Complete";

        completeBtn.addEventListener("click", function() {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            filterByCategory();
            updateProgress();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {
            tasks.splice(index, 1);
            saveTasks();
            filterByCategory();
            updateProgress();
        });

        li.appendChild(span);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateProgress();
}
function searchTasks() {
    const searchText = document
        .getElementById("searchInput")
        .value.toLowerCase()
        .trim();

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(function(task) {
        return task.text.toLowerCase().includes(searchText);
    });

    filteredTasks.forEach(function(task) {
        const index = tasks.indexOf(task);

        const li = document.createElement("li");
        const span = document.createElement("span");

        span.textContent =
            task.text + " (" + (task.category || "Other") + ")";

        if (task.completed) {
            span.style.textDecoration = "line-through";
            span.style.color = "green";
        }

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Complete";

        completeBtn.addEventListener("click", function() {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            searchTasks();
            updateProgress();
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function() {
            const newText = prompt("Enter updated task:", task.text);

            if (newText !== null && newText.trim() !== "") {
                tasks[index].text = newText.trim();
                saveTasks();
                searchTasks();
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {
            tasks.splice(index, 1);
            saveTasks();
            searchTasks();
            updateProgress();
        });

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}
const dailyGoalInput = document.getElementById("dailyGoal");
const saveGoalBtn = document.getElementById("saveGoalBtn");
const goalMessage = document.getElementById("goalMessage");

dailyGoalInput.value = localStorage.getItem("dailyGoal") || "";

function updateGoalMessage() {
    const goal = Number(localStorage.getItem("dailyGoal")) || 0;
    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const progressFill = document.getElementById("goalProgressFill");
const progressText = document.getElementById("goalProgressText");

if (goal === 0) {
    goalMessage.textContent = "Set your daily target!";
    progressFill.style.width = "0%";
    progressText.textContent = "0% completed";
} else {
    const percentage = Math.min(
        100,
        Math.round((completed / goal) * 100)
    );

    goalMessage.textContent =
        "Your target: " + goal +
        " tasks | Completed: " + completed;

    progressFill.style.width = percentage + "%";
    progressText.textContent = percentage + "% completed";
}
}

saveGoalBtn.addEventListener("click", function() {
    const goal = Number(dailyGoalInput.value);

    if (!Number.isInteger(goal) || goal < 1) {
        alert("Please enter a whole number greater than 0!");
        return;
    }

    localStorage.setItem("dailyGoal", goal);
    updateGoalMessage();
});

updateGoalMessage();
function updateStreak() {
    const today = new Date().toDateString();

    let lastStudyDate = localStorage.getItem("lastStudyDate");
    let streak = Number(localStorage.getItem("studyStreak")) || 0;

    if (lastStudyDate === today) {
        document.getElementById("streakCount").textContent =
            streak + (streak === 1 ? " Day" : " Days");
        return;
    }

    const completedToday = tasks.some(function(task) {
        return task.completed && task.completedDate === today;
    });

    if (completedToday) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastStudyDate === yesterday.toDateString()) {
            streak++;
        } else {
            streak = 1;
        }

        localStorage.setItem("studyStreak", streak);
        localStorage.setItem("lastStudyDate", today);
    }

    document.getElementById("streakCount").textContent =
        streak + (streak === 1 ? " Day" : " Days");
}

updateStreak();
function updateUpcomingDeadlines() {
    const deadlineList = document.getElementById("deadlineList");
    deadlineList.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingTasks = tasks
        .filter(function(task) {
            if (!task.deadline || task.completed) {
                return false;
            }

            const deadline = new Date(task.deadline + "T00:00:00");
            return deadline >= today;
        })
        .sort(function(a, b) {
            return a.deadline.localeCompare(b.deadline);
        });

    if (upcomingTasks.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No upcoming deadlines 🎉";
        deadlineList.appendChild(li);
        return;
    }

    upcomingTasks.forEach(function(task) {
        const li = document.createElement("li");

        li.textContent =
            task.text +
            " — " + task.deadline +
            " | Priority: " + (task.priority || "Medium");

        deadlineList.appendChild(li);
    });
}

updateUpcomingDeadlines();
function updateWeeklyReport() {
    const now = new Date();
    const day = now.getDay();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    weekStart.setHours(0, 0, 0, 0);

    const nextWeek = new Date(weekStart);
    nextWeek.setDate(weekStart.getDate() + 7);

    const weeklyTasks = tasks.filter(function(task) {
        if (!task.completedDate) {
            return false;
        }

        const completedDate = new Date(task.completedDate);

        return completedDate >= weekStart &&
               completedDate < nextWeek;
    });

    const completed = weeklyTasks.length;
    const total = tasks.length;
    const pending = total - tasks.filter(function(task) {
        return task.completed;
    }).length;

    document.getElementById("weeklyTotal").textContent = total;
    document.getElementById("weeklyCompleted").textContent = completed;
    document.getElementById("weeklyPending").textContent = pending;
}

updateWeeklyReport();