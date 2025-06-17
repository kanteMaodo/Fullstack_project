import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingService } from '../../services/wedding.service';
import { Task } from '../../models/wedding.models';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tasks-page fade-in">
      <div class="page-header">
        <h1>Gestion des tâches</h1>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <span class="material-icons">add_task</span>
          Ajouter une tâche
        </button>
      </div>

      <div class="tasks-overview grid grid-4">
        <div class="overview-card card">
          <div class="overview-icon total">
            <span class="material-icons">task_alt</span>
          </div>
          <div class="overview-content">
            <h3>{{ tasks.length }}</h3>
            <p>Tâches totales</p>
          </div>
        </div>

        <div class="overview-card card">
          <div class="overview-icon completed">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="overview-content">
            <h3>{{ getCompletedCount() }}</h3>
            <p>Terminées</p>
          </div>
        </div>

        <div class="overview-card card">
          <div class="overview-icon in-progress">
            <span class="material-icons">schedule</span>
          </div>
          <div class="overview-content">
            <h3>{{ getInProgressCount() }}</h3>
            <p>En cours</p>
          </div>
        </div>

        <div class="overview-card card">
          <div class="overview-icon pending">
            <span class="material-icons">pending</span>
          </div>
          <div class="overview-content">
            <h3>{{ getPendingCount() }}</h3>
            <p>En attente</p>
          </div>
        </div>
      </div>

      <div class="tasks-filters card">
        <div class="filters-row">
          <div class="filter-group">
            <label>Statut</label>
            <select [(ngModel)]="filterStatus" (change)="filterTasks()">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in-progress">En cours</option>
              <option value="completed">Terminées</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Priorité</label>
            <select [(ngModel)]="filterPriority" (change)="filterTasks()">
              <option value="">Toutes les priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Catégorie</label>
            <select [(ngModel)]="filterCategory" (change)="filterTasks()">
              <option value="">Toutes les catégories</option>
              <option value="planning">Planification</option>
              <option value="venue">Lieu</option>
              <option value="catering">Traiteur</option>
              <option value="decoration">Décoration</option>
              <option value="photography">Photographie</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>
      </div>

      <div class="tasks-grid">
        <div class="task-column" *ngFor="let status of taskStatuses">
          <div class="column-header">
            <div class="column-title">
              <span class="material-icons">{{ getStatusIcon(status.value) }}</span>
              <h3>{{ status.label }}</h3>
              <span class="task-count">{{ getTasksByStatus(status.value).length }}</span>
            </div>
          </div>
          
          <div class="task-cards">
            <div class="task-card card" 
                 *ngFor="let task of getTasksByStatus(status.value)"
                 (click)="editTask(task)">
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <div class="task-priority" [class]="'priority-' + task.priority"></div>
              </div>
              
              <p *ngIf="task.description" class="task-description">
                {{ task.description }}
              </p>
              
              <div class="task-meta">
                <div class="task-category">
                  <span class="material-icons">{{ getCategoryIcon(task.category) }}</span>
                  <span>{{ getCategoryLabel(task.category) }}</span>
                </div>
                
                <div class="task-due-date" [class.overdue]="isOverdue(task.dueDate)">
                  <span class="material-icons">schedule</span>
                  <span>{{ task.dueDate | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
              
              <div class="task-actions">
                <button class="btn-icon" (click)="editTask(task); $event.stopPropagation()" title="Modifier">
                  <span class="material-icons">edit</span>
                </button>
                <button class="btn-icon" 
                        (click)="toggleTaskStatus(task); $event.stopPropagation()" 
                        title="Changer le statut">
                  <span class="material-icons">{{ getNextStatusIcon(task.status) }}</span>
                </button>
                <button class="btn-icon delete" 
                        (click)="deleteTask(task); $event.stopPropagation()" 
                        title="Supprimer">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Task Modal -->
    <div class="modal-overlay" [class.active]="showAddModal || showEditModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Modifier' : 'Ajouter' }} une tâche</h2>
          <button class="btn-close" (click)="closeModal()">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <form (ngSubmit)="saveTask()" class="modal-body">
          <div class="input-group">
            <label>Titre *</label>
            <input type="text" [(ngModel)]="currentTask.title" name="title" required>
          </div>
          
          <div class="input-group">
            <label>Description</label>
            <textarea [(ngModel)]="currentTask.description" name="description" rows="3"></textarea>
          </div>
          
          <div class="form-row">
            <div class="input-group">
              <label>Date d'échéance *</label>
              <input type="date" [(ngModel)]="currentTask.dueDate" name="dueDate" required>
            </div>
            <div class="input-group">
              <label>Priorité</label>
              <select [(ngModel)]="currentTask.priority" name="priority">
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="input-group">
              <label>Statut</label>
              <select [(ngModel)]="currentTask.status" name="status">
                <option value="pending">En attente</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminée</option>
              </select>
            </div>
            <div class="input-group">
              <label>Catégorie</label>
              <select [(ngModel)]="currentTask.category" name="category">
                <option value="planning">Planification</option>
                <option value="venue">Lieu</option>
                <option value="catering">Traiteur</option>
                <option value="decoration">Décoration</option>
                <option value="photography">Photographie</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
          
          <div class="input-group">
            <label>Assigné à</label>
            <input type="text" [(ngModel)]="currentTask.assignedTo" name="assignedTo">
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" (click)="closeModal()">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary">
              {{ showEditModal ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .tasks-page {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0;
    }

    .tasks-overview {
      margin-bottom: 32px;
    }

    .overview-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }

    .overview-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .overview-icon.total {
      background: var(--accent-color);
    }

    .overview-icon.completed {
      background: #10b981;
    }

    .overview-icon.in-progress {
      background: #f59e0b;
    }

    .overview-icon.pending {
      background: #6b7280;
    }

    .overview-content h3 {
      font-size: 24px;
      margin: 0 0 4px 0;
    }

    .overview-content p {
      margin: 0;
      color: var(--text-secondary);
    }

    .tasks-filters {
      margin-bottom: 32px;
    }

    .filters-row {
      display: flex;
      gap: 24px;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-group label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .filter-group select {
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      background: var(--surface-color);
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      align-items: start;
    }

    .task-column {
      background: var(--background-color);
      border-radius: var(--border-radius);
      padding: 16px;
      min-height: 500px;
    }

    .column-header {
      margin-bottom: 16px;
    }

    .column-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-primary);
    }

    .column-title h3 {
      margin: 0;
      font-size: 16px;
      flex: 1;
    }

    .task-count {
      background: var(--border-color);
      color: var(--text-secondary);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .task-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .task-card {
      padding: 16px;
      cursor: pointer;
      transition: var(--transition);
      border: 1px solid var(--border-color);
    }

    .task-card:hover {
      border-color: var(--accent-color);
      transform: translateY(-1px);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 8px;
    }

    .task-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      flex: 1;
    }

    .task-priority {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-left: 8px;
      margin-top: 4px;
    }

    .priority-high {
      background: #ef4444;
    }

    .priority-medium {
      background: #f59e0b;
    }

    .priority-low {
      background: #10b981;
    }

    .task-description {
      font-size: 12px;
      color: var(--text-secondary);
      margin: 0 0 12px 0;
      line-height: 1.4;
    }

    .task-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }

    .task-category,
    .task-due-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--text-light);
    }

    .task-category .material-icons,
    .task-due-date .material-icons {
      font-size: 14px;
    }

    .task-due-date.overdue {
      color: #dc2626;
    }

    .task-actions {
      display: flex;
      gap: 4px;
      justify-content: flex-end;
    }

    .btn-icon {
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
      background: var(--background-color);
      color: var(--text-light);
    }

    .btn-icon:hover {
      background: var(--border-color);
      color: var(--text-secondary);
    }

    .btn-icon.delete:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: var(--transition);
    }

    .modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .modal {
      background: var(--surface-color);
      border-radius: var(--border-radius);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      transform: translateY(-20px);
      transition: var(--transition);
    }

    .modal-overlay.active .modal {
      transform: translateY(0);
    }

    .modal-header {
      padding: 24px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
    }

    .btn-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      color: var(--text-secondary);
      transition: var(--transition);
    }

    .btn-close:hover {
      background: var(--background-color);
    }

    .modal-body {
      padding: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    @media (max-width: 1024px) {
      .tasks-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .filters-row {
        flex-direction: column;
        gap: 16px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filterStatus = '';
  filterPriority = '';
  filterCategory = '';
  showAddModal = false;
  showEditModal = false;
  currentTask: Task = this.getEmptyTask();

  taskStatuses = [
    { value: 'pending', label: 'En attente' },
    { value: 'in-progress', label: 'En cours' },
    { value: 'completed', label: 'Terminées' }
  ];

  constructor(private weddingService: WeddingService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.weddingService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
    });
  }

  filterTasks() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesStatus = !this.filterStatus || task.status === this.filterStatus;
      const matchesPriority = !this.filterPriority || task.priority === this.filterPriority;
      const matchesCategory = !this.filterCategory || task.category === this.filterCategory;
      
      return matchesStatus && matchesPriority && matchesCategory;
    });
  }

  getTasksByStatus(status: string): Task[] {
    return this.filteredTasks.filter(task => task.status === status);
  }

  getCompletedCount(): number {
    return this.tasks.filter(t => t.status === 'completed').length;
  }

  getInProgressCount(): number {
    return this.tasks.filter(t => t.status === 'in-progress').length;
  }

  getPendingCount(): number {
    return this.tasks.filter(t => t.status === 'pending').length;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'pending';
      case 'in-progress': return 'schedule';
      case 'completed': return 'check_circle';
      default: return 'task_alt';
    }
  }

  getNextStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'play_arrow';
      case 'in-progress': return 'check';
      case 'completed': return 'refresh';
      default: return 'play_arrow';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'planning': return 'event_note';
      case 'venue': return 'location_on';
      case 'catering': return 'restaurant';
      case 'decoration': return 'palette';
      case 'photography': return 'camera_alt';
      default: return 'category';
    }
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'planning': return 'Planification';
      case 'venue': return 'Lieu';
      case 'catering': return 'Traiteur';
      case 'decoration': return 'Décoration';
      case 'photography': return 'Photographie';
      case 'other': return 'Autre';
      default: return category;
    }
  }

  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  }

  editTask(task: Task) {
    this.currentTask = { ...task };
    this.showEditModal = true;
  }

  toggleTaskStatus(task: Task) {
    let newStatus: 'pending' | 'in-progress' | 'completed';
    
    switch (task.status) {
      case 'pending':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'pending';
        break;
      default:
        newStatus = 'pending';
    }
    
    const updatedTask = { ...task, status: newStatus };
    this.weddingService.updateTask(updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(task: Task) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${task.title}" ?`)) {
      this.weddingService.deleteTask(task.id!).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  saveTask() {
    if (this.showEditModal) {
      this.weddingService.updateTask(this.currentTask).subscribe(() => {
        this.loadTasks();
        this.closeModal();
      });
    } else {
      this.weddingService.addTask(this.currentTask).subscribe(() => {
        this.loadTasks();
        this.closeModal();
      });
    }
  }

  closeModal() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.currentTask = this.getEmptyTask();
  }

  private getEmptyTask(): Task {
    return {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      category: 'planning',
      assignedTo: ''
    };
  }
}