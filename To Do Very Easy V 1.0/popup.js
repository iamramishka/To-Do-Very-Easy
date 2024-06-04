// Load tasks from local storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskText => addTaskToList(taskText));
}

// Add task to the DOM list
function addTaskToList(taskText) {
    var li = document.createElement('li');
    li.textContent = taskText;
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
        li.remove(); // Remove task from DOM
        saveTasks(); // Update local storage
    };
    li.appendChild(deleteBtn);
    document.getElementById('task-list').appendChild(li);
}

// Save all tasks to local storage
function saveTasks() {
    var tasks = [];
    document.querySelectorAll('#task-list li').forEach(function(taskItem) {
        tasks.push(taskItem.textContent.replace('Delete', '').trim());
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById('add-task').addEventListener('click', function() {
    var taskText = document.getElementById('new-task').value;
    if (taskText.trim() !== '') {
        addTaskToList(taskText);
        document.getElementById('new-task').value = ''; // clear input
        saveTasks(); // Save tasks to local storage
    }
});

// Initial load of tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasks);


function editTask(li) {
    var currentText = li.textContent.replace('Delete', '').trim();
    var input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    li.innerHTML = '';
    li.appendChild(input);

    input.addEventListener('blur', function() {
        li.innerHTML = '';
        li.textContent = input.value;
        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() {
            li.remove(); // Remove task from DOM
            saveTasks(); // Update local storage
        };
        li.appendChild(deleteBtn);
        saveTasks(); // Save the updated list to local storage
    });

    input.focus();
}

// Modify addTaskToList to include edit functionality
function addTaskToList(taskText) {
    var li = document.createElement('li');
    li.textContent = taskText;
    li.onclick = function() { editTask(li); }; // Click to edit
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
        li.remove(); // Remove task from DOM
        saveTasks(); // Update local storage
    };
    li.appendChild(deleteBtn);
    document.getElementById('task-list').appendChild(li);
}

