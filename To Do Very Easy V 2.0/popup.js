document.addEventListener('DOMContentLoaded', function () {
    loadSettings();
    renderTasks();

    // Attach event listeners
    document.getElementById('mode-toggle').addEventListener('change', toggleMode);
    document.getElementById('theme-toggle').addEventListener('change', toggleTheme);
    document.getElementById('add-task').addEventListener('click', addTask);
    document.getElementById('search-task').addEventListener('input', searchTasks);
    document.getElementById('export-tasks').addEventListener('click', exportTasks);
    document.getElementById('import-tasks').addEventListener('click', () => document.getElementById('import-file').click());
    document.getElementById('import-file').addEventListener('change', importTasks);
});

let isAdvancedMode = false;

function loadSettings() {
    chrome.storage.sync.get(['isAdvancedMode', 'theme'], function(data) {
        if (data.isAdvancedMode !== undefined) {
            isAdvancedMode = data.isAdvancedMode;
            document.getElementById('mode-toggle').checked = isAdvancedMode;
            document.getElementById('advanced-features').style.display = isAdvancedMode ? 'block' : 'none';
        }
        if (data.theme) {
            document.body.className = data.theme;
            document.getElementById('theme-toggle').checked = data.theme === 'dark';
        }
    });
}

function toggleMode() {
    isAdvancedMode = !isAdvancedMode;
    document.getElementById('advanced-features').style.display = isAdvancedMode ? 'block' : 'none';
    chrome.storage.sync.set({isAdvancedMode: isAdvancedMode});
    renderTasks(); // Re-render tasks which might include additional details in advanced mode
}

function toggleTheme() {
    const theme = document.getElementById('theme-toggle').checked ? 'dark' : 'light';
    document.body.className = theme;
    chrome.storage.sync.set({theme: theme});
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value;
    if (taskText.trim() === '') {
        alert('Task cannot be empty!');
        return;
    }

    const newTask = {
        text: taskText,
        completed: false,
        date: isAdvancedMode ? document.getElementById('task-date').value : undefined,
        time: isAdvancedMode ? document.getElementById('task-time').value : undefined,
        priority: isAdvancedMode ? document.getElementById('task-priority').value : undefined,
        recurrence: isAdvancedMode ? document.getElementById('task-recurrence').value : undefined
    };

    chrome.storage.sync.get({tasks: []}, function(data) {
        data.tasks.push(newTask);
        chrome.storage.sync.set({tasks: data.tasks}, function() {
            taskInput.value = '';
            renderTasks();
        });
    });
}

function renderTasks(tasks = []) {
    chrome.storage.sync.get({tasks: []}, function(data) {
        if (!tasks.length) tasks = data.tasks;
        const listElement = document.getElementById('tasks');
        listElement.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('li');
            taskElement.textContent = `${task.text} ${task.date ? ` (Due: ${task.date}${task.time ? ` ${task.time}` : ''})` : ''}`;
            taskElement.className = `${task.completed ? 'completed' : ''} ${document.body.className}`;
            taskElement.onclick = function() { toggleTaskCompletion(index); };
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = function(e) { e.stopPropagation(); editTask(index); };
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function(e) { e.stopPropagation(); deleteTask(index); };
            taskElement.appendChild(editButton);
            taskElement.appendChild(deleteButton);
            listElement.appendChild(taskElement);
        });
    });
}

function toggleTaskCompletion(index) {
    chrome.storage.sync.get({tasks: []}, function(data) {
        data.tasks[index].completed = !data.tasks[index].completed;
        chrome.storage.sync.set({tasks: data.tasks}, function() {
            renderTasks();
        });
    });
}

function editTask(index) {
    chrome.storage.sync.get({tasks: []}, function(data) {
        const task = data.tasks[index];
        const taskText = prompt("Edit task text:", task.text);
        if (taskText !== null) {
            task.text = taskText;
            if (isAdvancedMode) {
                task.date = document.getElementById('task-date').value;
                task.time = document.getElementById('task-time').value;
                task.priority = document.getElementById('task-priority').value;
                task.recurrence = document.getElementById('task-recurrence').value;
            }
            chrome.storage.sync.set({tasks: data.tasks}, function() {
                renderTasks();
            });
        }
    });
}

function deleteTask(index) {
    chrome.storage.sync.get({tasks: []}, function(data) {
        data.tasks.splice(index, 1);
        chrome.storage.sync.set({tasks: data.tasks}, function() {
            renderTasks();
        });
    });
}

function exportTasks() {
    chrome.storage.sync.get({tasks: []}, function(data) {
        const tasks = data.tasks;
        const worksheet = XLSX.utils.json_to_sheet(tasks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
        XLSX.writeFile(workbook, "tasks.xlsx");
    });
}

function importTasks(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const tasks = XLSX.utils.sheet_to_json(firstSheet, {header: 1});
        const taskArray = tasks.slice(1).map(task => ({
            text: task[0],
            completed: task[1] === 'TRUE',
            date: task[2],
            time: task[3],
            priority: task[4],
            recurrence: task[5]
        }));
        chrome.storage.sync.set({tasks: taskArray}, function() {
            renderTasks();
        });
    };
    reader.readAsArrayBuffer(file);
}

function searchTasks() {
    const searchText = document.getElementById('search-task').value.toLowerCase();
    chrome.storage.sync.get({tasks: []}, function(data) {
        const filteredTasks = data.tasks.filter(task => task.text.toLowerCase().includes(searchText));
        renderTasks(filteredTasks);  // Modify renderTasks to accept a task array
    });
}
