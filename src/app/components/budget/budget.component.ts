import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingService } from '../../services/wedding.service';
import { Budget } from '../../models/wedding.models';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="budget-page fade-in">
      <div class="page-header">
        <h1>Gestion du budget</h1>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <span class="material-icons">add_business</span>
          Ajouter une dépense
        </button>
      </div>

      <div class="budget-overview grid grid-4">
        <div class="overview-card card">
          <div class="overview-icon total">
            <span class="material-icons">account_balance_wallet</span>
          </div>
          <div class="overview-content">
            <h3>{{ getTotalBudget() | currency:'EUR':'symbol':'1.0-0' }}</h3>
            <p>Budget total</p>
          </div>
        </div>

        <div class="overview-card card">
          <div class="overview-icon spent">
            <span class="material-icons">trending_down</span>
          </div>
          <div class="overview-content">
            <h3>{{ getSpentAmount() | currency:'EUR':'symbol':'1.0-0' }}</h3>
            <p>Dépenses</p>
          </div>
        </div>

        <div class="overview-card card">
          <div class="overview-icon remaining">
            <span class="material-icons">savings</span>
          </div>
          <div class="overview-content">
            <h3>{{ getRemainingBudget() | currency:'EUR':'symbol':'1.0-0' }}</h3>
            <p>Restant</p>
          </div>
        </div>

        <div class="overview-card card">
          <div class="overview-icon percentage">
            <span class="material-icons">pie_chart</span>
          </div>
          <div class="overview-content">
            <h3>{{ getBudgetPercentage() }}%</h3>
            <p>Utilisé</p>
          </div>
        </div>
      </div>

      <div class="budget-progress card">
        <h2>Progression du budget</h2>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="getBudgetPercentage()"></div>
          </div>
          <div class="progress-labels">
            <span>0€</span>
            <span>{{ getTotalBudget() | currency:'EUR':'symbol':'1.0-0' }}</span>
          </div>
        </div>
      </div>

      <div class="budget-list card">
        <div class="list-header">
          <h2>Détail des dépenses</h2>
          <div class="filter-options">
            <select [(ngModel)]="filterStatus" (change)="filterBudgets()">
              <option value="">Tous les statuts</option>
              <option value="paid">Payé</option>
              <option value="unpaid">Non payé</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Fournisseur</th>
                <th>Budget estimé</th>
                <th>Montant réel</th>
                <th>Échéance</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let budget of filteredBudgets">
                <td>
                  <strong>{{ budget.category }}</strong>
                  <small *ngIf="budget.description">{{ budget.description }}</small>
                </td>
                <td>{{ budget.vendor || '-' }}</td>
                <td>{{ budget.estimatedAmount | currency:'EUR':'symbol':'1.0-0' }}</td>
                <td>
                  <span [class.over-budget]="budget.actualAmount > budget.estimatedAmount">
                    {{ budget.actualAmount | currency:'EUR':'symbol':'1.0-0' }}
                  </span>
                </td>
                <td>
                  <span *ngIf="budget.dueDate" 
                        [class.overdue]="isOverdue(budget.dueDate)">
                    {{ budget.dueDate | date:'dd/MM/yyyy' }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class]="budget.isPaid ? 'status-paid' : 'status-unpaid'">
                    {{ budget.isPaid ? 'Payé' : 'Non payé' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="editBudget(budget)" title="Modifier">
                      <span class="material-icons">edit</span>
                    </button>
                    <button class="btn-icon" 
                            [class.paid]="budget.isPaid"
                            (click)="togglePaymentStatus(budget)" 
                            [title]="budget.isPaid ? 'Marquer comme non payé' : 'Marquer comme payé'">
                      <span class="material-icons">
                        {{ budget.isPaid ? 'money_off' : 'payment' }}
                      </span>
                    </button>
                    <button class="btn-icon delete" (click)="deleteBudget(budget)" title="Supprimer">
                      <span class="material-icons">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Budget Modal -->
    <div class="modal-overlay" [class.active]="showAddModal || showEditModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Modifier' : 'Ajouter' }} une dépense</h2>
          <button class="btn-close" (click)="closeModal()">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <form (ngSubmit)="saveBudget()" class="modal-body">
          <div class="form-row">
            <div class="input-group">
              <label>Catégorie *</label>
              <input type="text" [(ngModel)]="currentBudget.category" name="category" required>
            </div>
            <div class="input-group">
              <label>Fournisseur</label>
              <input type="text" [(ngModel)]="currentBudget.vendor" name="vendor">
            </div>
          </div>
          
          <div class="form-row">
            <div class="input-group">
              <label>Budget estimé *</label>
              <input type="number" [(ngModel)]="currentBudget.estimatedAmount" 
                     name="estimatedAmount" min="0" step="0.01" required>
            </div>
            <div class="input-group">
              <label>Montant réel</label>
              <input type="number" [(ngModel)]="currentBudget.actualAmount" 
                     name="actualAmount" min="0" step="0.01">
            </div>
          </div>
          
          <div class="form-row">
            <div class="input-group">
              <label>Date d'échéance</label>
              <input type="date" [(ngModel)]="currentBudget.dueDate" name="dueDate">
            </div>
            <div class="input-group checkbox-group">
              <label>
                <input type="checkbox" [(ngModel)]="currentBudget.isPaid" name="isPaid">
                Déjà payé
              </label>
            </div>
          </div>
          
          <div class="input-group">
            <label>Description</label>
            <textarea [(ngModel)]="currentBudget.description" name="description" rows="3"></textarea>
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
    .budget-page {
      max-width: 1200px;
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

    .budget-overview {
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

    .overview-icon.spent {
      background: #ef4444;
    }

    .overview-icon.remaining {
      background: #10b981;
    }

    .overview-icon.percentage {
      background: var(--secondary-color);
    }

    .overview-content h3 {
      font-size: 20px;
      margin: 0 0 4px 0;
    }

    .overview-content p {
      margin: 0;
      color: var(--text-secondary);
    }

    .budget-progress {
      margin-bottom: 32px;
    }

    .budget-progress h2 {
      margin-bottom: 20px;
    }

    .progress-container {
      position: relative;
    }

    .progress-bar {
      width: 100%;
      height: 12px;
      background: var(--border-color);
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
      transition: var(--transition);
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-light);
    }

    .budget-list {
      padding: 0;
      overflow: hidden;
    }

    .list-header {
      padding: 24px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .list-header h2 {
      margin: 0;
    }

    .filter-options {
      display: flex;
      gap: 16px;
    }

    .table-responsive {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    th {
      background: var(--background-color);
      font-weight: 600;
      color: var(--text-primary);
    }

    .over-budget {
      color: #dc2626;
      font-weight: 600;
    }

    .overdue {
      color: #dc2626;
      font-weight: 500;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-paid {
      background: #dcfce7;
      color: #16a34a;
    }

    .status-unpaid {
      background: #fee2e2;
      color: #dc2626;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
      background: var(--background-color);
      color: var(--text-secondary);
    }

    .btn-icon:hover {
      background: var(--border-color);
    }

    .btn-icon.paid {
      background: #dcfce7;
      color: #16a34a;
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

    .checkbox-group {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .list-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
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
export class BudgetComponent implements OnInit {
  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  filterStatus = '';
  showAddModal = false;
  showEditModal = false;
  currentBudget: Budget = this.getEmptyBudget();

  constructor(private weddingService: WeddingService) {}

  ngOnInit() {
    this.loadBudgets();
  }

  loadBudgets() {
    this.weddingService.getBudgets().subscribe(budgets => {
      this.budgets = budgets;
      this.filteredBudgets = budgets;
    });
  }

  filterBudgets() {
    this.filteredBudgets = this.budgets.filter(budget => {
      if (this.filterStatus === 'paid') {
        return budget.isPaid;
      } else if (this.filterStatus === 'unpaid') {
        return !budget.isPaid;
      }
      return true;
    });
  }

  getTotalBudget(): number {
    return this.budgets.reduce((sum, budget) => sum + budget.estimatedAmount, 0);
  }

  getSpentAmount(): number {
    return this.budgets.reduce((sum, budget) => sum + budget.actualAmount, 0);
  }

  getRemainingBudget(): number {
    return this.getTotalBudget() - this.getSpentAmount();
  }

  getBudgetPercentage(): number {
    const total = this.getTotalBudget();
    if (total === 0) return 0;
    return Math.round((this.getSpentAmount() / total) * 100);
  }

  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  }

  editBudget(budget: Budget) {
    this.currentBudget = { ...budget };
    this.showEditModal = true;
  }

  togglePaymentStatus(budget: Budget) {
    const updatedBudget = { ...budget, isPaid: !budget.isPaid };
    this.weddingService.updateBudget(updatedBudget).subscribe(() => {
      this.loadBudgets();
    });
  }

  deleteBudget(budget: Budget) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${budget.category} ?`)) {
      this.weddingService.deleteBudget(budget.id!).subscribe(() => {
        this.loadBudgets();
      });
    }
  }

  saveBudget() {
    if (this.showEditModal) {
      this.weddingService.updateBudget(this.currentBudget).subscribe(() => {
        this.loadBudgets();
        this.closeModal();
      });
    } else {
      this.weddingService.addBudget(this.currentBudget).subscribe(() => {
        this.loadBudgets();
        this.closeModal();
      });
    }
  }

  closeModal() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.currentBudget = this.getEmptyBudget();
  }

  private getEmptyBudget(): Budget {
    return {
      category: '',
      estimatedAmount: 0,
      actualAmount: 0,
      isPaid: false,
      vendor: '',
      description: ''
    };
  }
}