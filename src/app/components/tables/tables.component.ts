import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingService } from '../../services/wedding.service';
import { Table, Guest } from '../../models/wedding.models';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tables-page fade-in">
      <div class="page-header">
        <h1>Gestion des tables</h1>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <span class="material-icons">table_restaurant</span>
          Ajouter une table
        </button>
      </div>

      <div class="tables-overview grid grid-3">
        <div class="overview-card card">
          <div class="overview-icon">
            <span class="material-icons">table_restaurant</span>
          </div>
          <div class="overview-content">
            <h3>{{ tables.length }}</h3>
            <p>Tables créées</p>
          </div>
        </div>

        <div class="overview-card card">
          <div class="overview-icon capacity">
            <span class="material-icons">people</span>
          </div>
          <div class="overview-content">
            <h3>{{ getTotalCapacity() }}</h3>
            <p>Capacité totale</p>
          </div>
        </div>

        <div class="overview-card card">
          <div class="overview-icon occupied">
            <span class="material-icons">event_seat</span>
          </div>
          <div class="overview-content">
            <h3>{{ getOccupiedSeats() }}</h3>
            <p>Places occupées</p>
          </div>
        </div>
      </div>

      <div class="tables-grid grid grid-3">
        <div class="table-card card" *ngFor="let table of tables">
          <div class="table-header">
            <h3>{{ table.name }}</h3>
            <div class="table-actions">
              <button class="btn-icon" (click)="editTable(table)" title="Modifier">
                <span class="material-icons">edit</span>
              </button>
              <button class="btn-icon delete" (click)="deleteTable(table)" title="Supprimer">
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>
          
          <div class="table-info">
            <div class="capacity-bar">
              <div class="capacity-fill" 
                   [style.width.%]="getCapacityPercentage(table)"></div>
            </div>
            <div class="capacity-text">
              {{ table.occupiedSeats }} / {{ table.capacity }} places
            </div>
          </div>
          
          <div class="table-details">
            <div class="detail-item" *ngIf="table.location">
              <span class="material-icons">location_on</span>
              <span>{{ table.location }}</span>
            </div>
            <div class="detail-item" *ngIf="table.notes">
              <span class="material-icons">notes</span>
              <span>{{ table.notes }}</span>
            </div>
          </div>
          
          <div class="table-guests" *ngIf="getTableGuests(table.id!).length > 0">
            <h4>Invités assignés</h4>
            <div class="guest-list">
              <div class="guest-item" *ngFor="let guest of getTableGuests(table.id!)">
                <span>{{ guest.firstName }} {{ guest.lastName }}</span>
                <button class="btn-remove" (click)="removeGuestFromTable(guest)" title="Retirer">
                  <span class="material-icons">close</span>
                </button>
              </div>
            </div>
          </div>
          
          <button class="btn btn-outline assign-btn" (click)="showAssignModal(table)">
            <span class="material-icons">person_add</span>
            Assigner des invités
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Table Modal -->
    <div class="modal-overlay" [class.active]="showAddModal || showEditModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Modifier' : 'Ajouter' }} une table</h2>
          <button class="btn-close" (click)="closeModal()">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <form (ngSubmit)="saveTable()" class="modal-body">
          <div class="input-group">
            <label>Nom de la table *</label>
            <input type="text" [(ngModel)]="currentTable.name" name="name" required>
          </div>
          
          <div class="input-group">
            <label>Capacité *</label>
            <input type="number" [(ngModel)]="currentTable.capacity" 
                   name="capacity" min="1" max="20" required>
          </div>
          
          <div class="input-group">
            <label>Emplacement</label>
            <input type="text" [(ngModel)]="currentTable.location" name="location">
          </div>
          
          <div class="input-group">
            <label>Notes</label>
            <textarea [(ngModel)]="currentTable.notes" name="notes" rows="3"></textarea>
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

    <!-- Assign Guests Modal -->
    <div class="modal-overlay" [class.active]="showAssignGuestsModal" (click)="closeAssignModal()">
      <div class="modal large" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Assigner des invités - {{ selectedTable?.name }}</h2>
          <button class="btn-close" (click)="closeAssignModal()">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="available-guests">
            <h3>Invités disponibles</h3>
            <div class="guests-list">
              <div class="guest-item assignable" 
                   *ngFor="let guest of getAvailableGuests()"
                   (click)="assignGuestToTable(guest)">
                <div class="guest-info">
                  <strong>{{ guest.firstName }} {{ guest.lastName }}</strong>
                  <small>{{ guest.email }}</small>
                </div>
                <span class="material-icons">add</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tables-page {
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

    .tables-overview {
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
      background: var(--accent-color);
      color: white;
    }

    .overview-icon.capacity {
      background: var(--secondary-color);
    }

    .overview-icon.occupied {
      background: #10b981;
    }

    .overview-content h3 {
      font-size: 24px;
      margin: 0 0 4px 0;
    }

    .overview-content p {
      margin: 0;
      color: var(--text-secondary);
    }

    .table-card {
      padding: 20px;
      border: 2px solid var(--border-color);
      transition: var(--transition);
    }

    .table-card:hover {
      border-color: var(--accent-color);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .table-header h3 {
      margin: 0;
      color: var(--accent-color);
    }

    .table-actions {
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

    .btn-icon.delete:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .table-info {
      margin-bottom: 16px;
    }

    .capacity-bar {
      width: 100%;
      height: 8px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .capacity-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
      transition: var(--transition);
    }

    .capacity-text {
      font-size: 14px;
      color: var(--text-secondary);
      text-align: center;
    }

    .table-details {
      margin-bottom: 16px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .detail-item .material-icons {
      font-size: 18px;
    }

    .table-guests {
      margin-bottom: 16px;
    }

    .table-guests h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: var(--text-primary);
    }

    .guest-list {
      max-height: 120px;
      overflow-y: auto;
    }

    .guest-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      margin-bottom: 4px;
      font-size: 13px;
    }

    .guest-item.assignable {
      cursor: pointer;
      transition: var(--transition);
    }

    .guest-item.assignable:hover {
      background: var(--primary-color);
      border-color: var(--accent-color);
    }

    .btn-remove {
      background: none;
      border: none;
      color: var(--text-light);
      cursor: pointer;
      padding: 2px;
      border-radius: 50%;
      transition: var(--transition);
    }

    .btn-remove:hover {
      color: #dc2626;
      background: #fee2e2;
    }

    .assign-btn {
      width: 100%;
      justify-content: center;
      margin-top: 12px;
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
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      transform: translateY(-20px);
      transition: var(--transition);
    }

    .modal.large {
      max-width: 600px;
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

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .available-guests h3 {
      margin-bottom: 16px;
    }

    .guests-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .guest-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .guest-info small {
      color: var(--text-light);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .tables-grid {
        grid-template-columns: 1fr;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class TablesComponent implements OnInit {
  tables: Table[] = [];
  guests: Guest[] = [];
  showAddModal = false;
  showEditModal = false;
  showAssignGuestsModal = false;
  currentTable: Table = this.getEmptyTable();
  selectedTable: Table | null = null;

  constructor(private weddingService: WeddingService) {}

  ngOnInit() {
    this.loadTables();
    this.loadGuests();
  }

  loadTables() {
    this.weddingService.getTables().subscribe(tables => {
      this.tables = tables;
    });
  }

  loadGuests() {
    this.weddingService.getGuests().subscribe(guests => {
      this.guests = guests;
    });
  }

  getTotalCapacity(): number {
    return this.tables.reduce((sum, table) => sum + table.capacity, 0);
  }

  getOccupiedSeats(): number {
    return this.tables.reduce((sum, table) => sum + table.occupiedSeats, 0);
  }

  getCapacityPercentage(table: Table): number {
    return (table.occupiedSeats / table.capacity) * 100;
  }

  getTableGuests(tableId: number): Guest[] {
    return this.guests.filter(guest => guest.tableId === tableId);
  }

  getAvailableGuests(): Guest[] {
    return this.guests.filter(guest => !guest.tableId && guest.rsvpStatus === 'confirmed');
  }

  editTable(table: Table) {
    this.currentTable = { ...table };
    this.showEditModal = true;
  }

  deleteTable(table: Table) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${table.name} ?`)) {
      this.weddingService.deleteTable(table.id!).subscribe(() => {
        this.loadTables();
      });
    }
  }

  saveTable() {
    if (this.showEditModal) {
      this.weddingService.updateTable(this.currentTable).subscribe(() => {
        this.loadTables();
        this.closeModal();
      });
    } else {
      this.weddingService.addTable(this.currentTable).subscribe(() => {
        this.loadTables();
        this.closeModal();
      });
    }
  }

  showAssignModal(table: Table) {
    this.selectedTable = table;
    this.showAssignGuestsModal = true;
  }

  assignGuestToTable(guest: Guest) {
    if (this.selectedTable) {
      const updatedGuest = { ...guest, tableId: this.selectedTable.id };
      this.weddingService.updateGuest(updatedGuest).subscribe(() => {
        this.loadGuests();
        this.updateTableOccupancy();
      });
    }
  }

  removeGuestFromTable(guest: Guest) {
    const updatedGuest = { ...guest, tableId: undefined };
    this.weddingService.updateGuest(updatedGuest).subscribe(() => {
      this.loadGuests();
      this.updateTableOccupancy();
    });
  }

  updateTableOccupancy() {
    this.tables.forEach(table => {
      const guestsCount = this.getTableGuests(table.id!).length;
      if (table.occupiedSeats !== guestsCount) {
        const updatedTable = { ...table, occupiedSeats: guestsCount };
        this.weddingService.updateTable(updatedTable).subscribe();
      }
    });
    this.loadTables();
  }

  closeModal() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.currentTable = this.getEmptyTable();
  }

  closeAssignModal() {
    this.showAssignGuestsModal = false;
    this.selectedTable = null;
  }

  private getEmptyTable(): Table {
    return {
      name: '',
      capacity: 6,
      occupiedSeats: 0,
      location: '',
      notes: ''
    };
  }
}