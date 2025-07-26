"use strict";
// Utility Functions
var generateId = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
var formatDate = function (date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
// Task Class
var Task = /** @class */ (function () {
    function Task(title, description, priority) {
        if (description === void 0) { description = ''; }
        if (priority === void 0) { priority = 'medium'; }
        this.id = generateId();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.completed = false;
        this.createdAt = new Date();
    }
    Task.prototype.toggleCompletion = function () {
        this.completed = !this.completed;
    };
    Task.prototype.updatePriority = function (newPriority) {
        this.priority = newPriority;
    };
    Task.prototype.updateDescription = function (newDescription) {
        this.description = newDescription;
    };
    return Task;
}());
// TaskManager Class
var TaskManager = /** @class */ (function () {
    function TaskManager() {
        this.tasks = [];
        this.currentFilter = 0; // TaskFilter.All
        this.loadTasks();
    }
    TaskManager.prototype.addTask = function (task) {
        this.tasks.push(task);
        this.saveTasks();
        this.updateUI();
        this.showNotification('Task added successfully!', 'success');
    };
    // ... more methods
    return TaskManager;
}());
// Initialize the Application
document.addEventListener('DOMContentLoaded', function () {
    var taskManager = new TaskManager();
    // ... rest of the initialization code
});


