// =============== TypeScript Implementation ===============
        
// 1. Interfaces for Type Safety
interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    createdAt: Date;
}

// 2. Enums for Constants
enum TaskFilter {
    All = 'all',
    Active = 'active',
    Completed = 'completed'
}

// 3. Utility Functions
const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// 4. Task Class - Demonstrating OOP with TypeScript
class Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    createdAt: Date;

    constructor(
        title: string,
        description: string = '',
        priority: 'low' | 'medium' | 'high' = 'medium'
    ) {
        this.id = generateId();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.completed = false;
        this.createdAt = new Date();
    }

    toggleCompletion(): void {
        this.completed = !this.completed;
    }

    updatePriority(newPriority: 'low' | 'medium' | 'high'): void {
        this.priority = newPriority;
    }

    updateDescription(newDescription: string): void {
        this.description = newDescription;
    }
}

// 5. TaskManager Class - Core Application Logic
class TaskManager {
    private tasks: Task[] = [];
    private currentFilter: TaskFilter = TaskFilter.All;

    constructor() {
        this.loadTasks();
    }

    addTask(task: Task): void {
        this.tasks.push(task);
        this.saveTasks();
        this.updateUI();
        this.showNotification('Task added successfully!', 'success');
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.updateUI();
        this.showNotification('Task deleted successfully!', 'success');
    }

    toggleTaskCompletion(id: string): void {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.toggleCompletion();
            this.saveTasks();
            this.updateUI();
            this.showNotification(
                task.completed ? 'Task completed!' : 'Task marked as active', 
                'info'
            );
        }
    }

    editTask(id: string, newTitle: string, newDescription: string): void {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.title = newTitle;
            task.updateDescription(newDescription);
            this.saveTasks();
            this.updateUI();
            this.showNotification('Task updated successfully!', 'success');
        }
    }

    getFilteredTasks(): Task[] {
        switch (this.currentFilter) {
            case TaskFilter.Active:
                return this.tasks.filter(task => !task.completed);
            case TaskFilter.Completed:
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    setFilter(filter: TaskFilter): void {
        this.currentFilter = filter;
        this.updateUI();
    }

    getStats(): { total: number; active: number; completed: number } {
        const total = this.tasks.length;
        const active = this.tasks.filter(task => !task.completed).length;
        const completed = total - active;
        return { total, active, completed };
    }

    private saveTasks(): void {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    private loadTasks(): void {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            // Convert string dates back to Date objects
            this.tasks = parsedTasks.map((task: any) => {
                const t = new Task(task.title, task.description, task.priority);
                t.id = task.id;
                t.completed = task.completed;
                t.createdAt = new Date(task.createdAt);
                return t;
            });
            this.updateUI();
        }
    }

    private updateUI(): void {
        const taskList = document.getElementById('taskList') as HTMLUListElement;
        const emptyState = document.getElementById('emptyState') as HTMLDivElement;
        const filteredTasks = this.getFilteredTasks();
        
        // Update task list
        taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            
            filteredTasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.dataset.id = task.id;
                
                // Priority indicator
                let priorityColor = '';
                switch (task.priority) {
                    case 'low':
                        priorityColor = '#4caf50';
                        break;
                    case 'medium':
                        priorityColor = '#ff9800';
                        break;
                    case 'high':
                        priorityColor = '#f44336';
                        break;
                }
                
                taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <div class="task-content">
                        <div class="task-title">${task.title}</div>
                        <div class="task-description">${task.description}</div>
                        <div class="task-date">Created: ${formatDate(task.createdAt)}</div>
                    </div>
                    <div class="task-actions">
                        <button class="task-btn edit" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-btn delete" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                
                // Add priority indicator
                const priorityIndicator = document.createElement('div');
                priorityIndicator.style.width = '8px';
                priorityIndicator.style.height = '8px';
                priorityIndicator.style.borderRadius = '50%';
                priorityIndicator.style.backgroundColor = priorityColor;
                priorityIndicator.style.marginRight = '15px';
                priorityIndicator.style.marginTop = '6px';
                
                taskItem.insertBefore(priorityIndicator, taskItem.firstChild);
                
                taskList.appendChild(taskItem);
            });
        }
        
        // Update stats
        const stats = this.getStats();
        document.getElementById('totalTasks').textContent = stats.total;
        document.getElementById('activeTasks').textContent = stats.active;
        document.getElementById('completedTasks').textContent = stats.completed;
    }

    private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
        const notification = document.getElementById('notification') as HTMLDivElement;
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// 6. Initialize the Application
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    
    // Form submission
    const taskForm = document.getElementById('taskForm') as HTMLFormElement;
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const titleInput = document.getElementById('taskTitle') as HTMLInputElement;
        const descriptionInput = document.getElementById('taskDescription') as HTMLTextAreaElement;
        const priorityInput = document.getElementById('taskPriority') as HTMLSelectElement;
        
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const priority = priorityInput.value as 'low' | 'medium' | 'high';
        
        if (title) {
            const newTask = new Task(title, description, priority);
            taskManager.addTask(newTask);
            
            // Reset form
            titleInput.value = '';
            descriptionInput.value = '';
            priorityInput.value = 'medium';
        } else {
            taskManager.showNotification('Please enter a task title!', 'error');
        }
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter as TaskFilter;
            taskManager.setFilter(filter);
        });
    });
    
    // Task actions (using event delegation)
    const taskList = document.getElementById('taskList');
    taskList.addEventListener('click', (e) => {
        const taskItem = (e.target as HTMLElement).closest('.task-item');
        if (!taskItem) return;
        
        const taskId = taskItem.dataset.id;
        
        // Checkbox click
        if ((e.target as HTMLElement).classList.contains('task-checkbox')) {
            taskManager.toggleTaskCompletion(taskId);
        }
        
        // Delete button click
        if ((e.target as HTMLElement).classList.contains('fa-trash-alt') || 
            (e.target as HTMLElement).classList.contains('delete')) {
            taskManager.deleteTask(taskId);
        }
        
        // Edit button click
        if ((e.target as HTMLElement).classList.contains('fa-edit') || 
            (e.target as HTMLElement).classList.contains('edit')) {
            const task = taskManager.getFilteredTasks().find(t => t.id === taskId);
            if (task) {
                const newTitle = prompt('Enter new title:', task.title);
                if (newTitle !== null && newTitle.trim() !== '') {
                    const newDescription = prompt('Enter new description:', task.description);
                    taskManager.editTask(taskId, newTitle.trim(), newDescription || '');
                }
            }
        }
    });
    
    // Add some sample tasks for demonstration
    if (taskManager.getStats().total === 0) {
        const sampleTasks = [
            new Task('Complete TypeScript project', 'Finish the task manager with TypeScript', 'high'),
            new Task('Buy groceries', 'Milk, eggs, bread, and vegetables', 'medium'),
            new Task('Read a book', 'Continue reading "Clean Code"', 'low')
        ];
        
        sampleTasks.forEach(task => taskManager.addTask(task));
    }
});
