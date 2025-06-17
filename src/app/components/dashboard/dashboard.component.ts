import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeddingService } from '../../services/wedding.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard fade-in">
      <div class="welcome-section">
        <div class="welcome-card card">
          <div class="welcome-content">
            <h1>Bienvenue dans votre planificateur de mariage</h1>
            <p *ngIf="weddingInfo">
              <span class="highlight">{{ weddingInfo.brideName }}</span> & 
              <span class="highlight">{{ weddingInfo.groomName }}</span>
            </p>
            <p *ngIf="weddingInfo" class="wedding-date">
              <span class="material-icons">event</span>
              {{ weddingInfo.weddingDate | date:'dd MMMM yyyy' }}
            </p>
          </div>
          <div class="welcome-image">
            <span class="material-icons">favorite</span>
          </div>
        </div>
      </div>

      <div class="stats-grid grid grid-4">
        <div class="stat-card card">
          <div class="stat-icon guests">
            <span class="material-icons">people</span>
          </div>
          <div class="stat-content">
            <h3>{{ statistics?.totalGuests || 0 }}</h3>
            <p>Invités totaux</p>
            <small>{{ statistics?.confirmedGuests || 0 }} confirmés</small>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon tables">
            <span class="material-icons">table_restaurant</span>
          </div>
          <div class="stat-content">
            <h3>{{ statistics?.totalTables || 0 }}</h3>
            <p>Tables préparées</p>
            <small>{{ getOccupiedTables() }} occupées</small>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon budget">
            <span class="material-icons">account_balance_wallet</span>
          </div>
          <div class="stat-content">
            <h3>{{ (statistics?.spentBudget || 0) | currency:'EUR':'symbol':'1.0-0' }}</h3>
            <p>Budget dépensé</p>
            <small>{{ getBudgetPercentage() }}% du total</small>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon tasks">
            <span class="material-icons">task_alt</span>
          </div>
          <div class="stat-content">
            <h3>{{ statistics?.completedTasks || 0 }}/{{ statistics?.totalTasks || 0 }}</h3>
            <p>Tâches terminées</p>
            <small>{{ getTasksPercentage() }}% complété</small>
          </div>
        </div>
      </div>

      <div class="dashboard-grid grid grid-2">
        <div class="recent-section card">
          <h2>
            <span class="material-icons">schedule</span>
            Tâches récentes
          </h2>
          <div class="recent-tasks">
            <div class="task-item" *ngFor="let task of recentTasks">
              <div class="task-priority" [class]="'priority-' + task.priority"></div>
              <div class="task-info">
                <h4>{{ task.title }}</h4>
                <p>{{ task.dueDate | date:'dd/MM/yyyy' }}</p>
              </div>
              <div class="task-status" [class]="'status-' + task.status">
                <span class="material-icons">
                  {{ getTaskStatusIcon(task.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="budget-overview card">
          <h2>
            <span class="material-icons">bar_chart</span>
            Aperçu du budget
          </h2>
          <div class="budget-progress">
            <div class="progress-bar">
              <div class="progress-fill" 
                   [style.width.%]="getBudgetPercentage()"></div>
            </div>
            <div class="budget-details">
              <div class="budget-item">
                <span>Dépensé</span>
                <strong>{{ (statistics?.spentBudget || 0) | currency:'EUR':'symbol':'1.0-0' }}</strong>
              </div>
              <div class="budget-item">
                <span>Restant</span>
                <strong>{{ (statistics?.remainingBudget || 0) | currency:'EUR':'symbol':'1.0-0' }}</strong>
              </div>
              <div class="budget-item">
                <span>Total</span>
                <strong>{{ (statistics?.totalBudget || 0) | currency:'EUR':'symbol':'1.0-0' }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Actions rapides</h2>
        <div class="actions-grid grid grid-4">
          <button class="action-btn card" routerLink="/guests">
            <span class="material-icons">person_add</span>
            <span>Ajouter un invité</span>
          </button>
          <button class="action-btn card" routerLink="/tables">
            <span class="material-icons">table_restaurant</span>
            <span>Gérer les tables</span>
          </button>
          <button class="action-btn card" routerLink="/budget">
            <span class="material-icons">add_shopping_cart</span>
            <span>Ajouter une dépense</span>
          </button>
          <button class="action-btn card" routerLink="/tasks">
            <span class="material-icons">add_task</span>
            <span>Créer une tâche</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 32px;
    }

    .welcome-card {
      background: linear-gradient(135deg, var(--primary-color), #f0d0d0);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32px;
      border: none;
    }

    .welcome-content h1 {
      font-size: 32px;
      margin-bottom: 16px;
      color: var(--text-primary);
    }

    .welcome-content p {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .highlight {
      color: var(--accent-color);
      font-weight: 600;
    }

    .wedding-date {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .welcome-image {
      font-size: 80px;
      color: var(--accent-color);
      opacity: 0.7;
    }

    .stats-grid {
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }

    .stat-icon.guests {
      background: var(--accent-color);
    }

    .stat-icon.tables {
      background: var(--secondary-color);
    }

    .stat-icon.budget {
      background: #10b981;
    }

    .stat-icon.tasks {
      background: #8b5cf6;
    }

    .stat-content h3 {
      font-size: 28px;
      margin: 0 0 4px 0;
      color: var(--text-primary);
    }

    .stat-content p {
      margin: 0 0 4px 0;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .stat-content small {
      color: var(--text-light);
      font-size: 12px;
    }

    .dashboard-grid {
      margin-bottom: 32px;
    }

    .recent-section h2,
    .budget-overview h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .task-item:last-child {
      border-bottom: none;
    }

    .task-priority {
      width: 4px;
      height: 30px;
      border-radius: 2px;
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

    .task-info {
      flex: 1;
    }

    .task-info h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 500;
    }

    .task-info p {
      margin: 0;
      font-size: 12px;
      color: var(--text-light);
    }

    .task-status {
      padding: 4px;
      border-radius: 50%;
    }

    .status-completed {
      background: #dcfce7;
      color: #16a34a;
    }

    .status-in-progress {
      background: #fef3c7;
      color: #d97706;
    }

    .status-pending {
      background: #f3f4f6;
      color: #6b7280;
    }

    .budget-progress {
      margin-top: 20px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
      transition: var(--transition);
    }

    .budget-details {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .budget-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .budget-item span {
      font-size: 12px;
      color: var(--text-light);
    }

    .budget-item strong {
      font-size: 16px;
      color: var(--text-primary);
    }

    .quick-actions h2 {
      margin-bottom: 20px;
    }

    .actions-grid {
      margin-bottom: 20px;
    }

    .action-btn {
      background: var(--surface-color);
      border: none;
      padding: 24px;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text-primary);
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-hover);
    }

    .action-btn .material-icons {
      font-size: 32px;
      color: var(--accent-color);
    }

    .action-btn span:last-child {
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .welcome-card {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }

      .welcome-content h1 {
        font-size: 24px;
      }

      .welcome-image {
        font-size: 60px;
      }

      .stat-card {
        flex-direction: column;
        text-align: center;
      }

      .budget-details {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  weddingInfo: any;
  statistics: any;
  recentTasks: any[] = [];

  constructor(private weddingService: WeddingService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.weddingService.getWeddingInfo().subscribe(info => {
      this.weddingInfo = info;
    });

    this.weddingService.getStatistics().subscribe(stats => {
      this.statistics = stats;
    });

    this.weddingService.getTasks().subscribe(tasks => {
      this.recentTasks = tasks.slice(0, 5);
    });
  }

  getBudgetPercentage(): number {
    if (!this.statistics || !this.statistics.totalBudget) return 0;
    return Math.round((this.statistics.spentBudget / this.statistics.totalBudget) * 100);
  }

  getTasksPercentage(): number {
    if (!this.statistics || !this.statistics.totalTasks) return 0;
    return Math.round((this.statistics.completedTasks / this.statistics.totalTasks) * 100);
  }

  getOccupiedTables(): number {
    // Mock data - replace with actual service call
    return 2;
  }

  getTaskStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'check_circle';
      case 'in-progress':
        return 'schedule';
      default:
        return 'radio_button_unchecked';
    }
  }
}