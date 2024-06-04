chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed and running in background.');
    // Set up an alarm for periodic checks or notifications if necessary
    chrome.alarms.create('checkTasks', { delayInMinutes: 1, periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkTasks') {
        checkTasks();
    }
});

function checkTasks() {
    chrome.storage.sync.get({tasks: []}, function(data) {
        const now = new Date().getTime();
        data.tasks.forEach(task => {
            if (task.date) {
                const taskDueDate = new Date(task.date).getTime();
                if (now >= taskDueDate && !task.notified) {
                    createNotification(task);
                    task.notified = true; // Mark as notified to avoid repetition
                }
            }
            if (task.recurrence && new Date(task.date) <= new Date()) {
                updateRecurringTask(task);
            }
        });
        // Save any changes made to the tasks
        chrome.storage.sync.set({tasks: data.tasks});
    });
}

function createNotification(task) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Task Due!',
        message: `Your task "${task.text}" is due today.`,
        priority: 2
    });
}

function updateRecurringTask(task) {
    // Calculate the next due date based on the recurrence rule
    const currentDate = new Date(task.date);
    switch (task.recurrence) {
        case 'daily':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
        case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
        case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
    }
    task.date = currentDate.toISOString().split('T')[0]; // Update the task's date
}
