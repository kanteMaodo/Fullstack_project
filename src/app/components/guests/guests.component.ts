import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingService } from '../../services/wedding.service';
import { Guest } from '../../models/wedding.models';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="guests-page fade-in">
      <div class="page-header">
        <h1>Gestion des invités</h1>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <span class="material-icons">person_add</span>
          Ajouter un invité
        </button>
      </div>

      <div class="guests-stats grid grid-4">
        <div class="stat-card card">
          <div class="stat-icon confirmed">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="stat-content">
            <h3>{{ getConfirmedCount() }}</h3>
            <p>Confirmés</p>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon pending">
            <span class="material-icons">schedule</span>
          </div>
          <div class="stat-content">
            <h3>{{ getPendingCount() }}</h3>
            <p>En attente</p>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon declined">
            <span class="material-icons">cancel</span>
          </div>
          <div class="stat-content">
            <h3>{{ getDeclinedCount() }}</h3>
            <p>Refusés</p>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon total">
            <span class="material-icons">people</span>
          </div>
          <div class="stat-content">
            <h3>{{ guests.length }}</h3>
            <p>Total</p>
          </div>
        </div>
      </div>

      <div class="guests-table card">
        <div class="table-header">
          <h2>Liste des invités</h2>
          <div class="table-actions">
            <div class="search-box">
              <span class="material-icons">search</span>
              <input type="text" 
                     placeholder="Rechercher..." 
                     [(ngModel)]="searchTerm"
                     (input)="filterGuests()">
            </div>
            <select [(ngModel)]="filterStatus" (change)="filterGuests()">
              <option value="">Tous les statuts</option>
              <option value="confirmed">Confirmés</option>
              <option value="pending">En attente</option>
              <option value="declined">Refusés</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Statut RSVP</th>
                <th>Catégorie</th>
                <th>Table</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let guest of filteredGuests">
                <td>
                  <div class="guest-name">
                    <strong>{{ guest.firstName }} {{ guest.lastName }}</strong>
                    <small *ngIf="guest.accompanyingGuests && guest.accompanyingGuests > 0">
                      +{{ guest.accompanyingGuests }} accompagnant(s)
                    </small>
                  </div>
                </td>
                <td>{{ guest.email }}</td>
                <td>{{ guest.phone || '-' }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + guest.rsvpStatus">
                    {{ getStatusLabel(guest.rsvpStatus) }}
                  </span>
                </td>
                <td>
                  <span class="category-badge" [class]="'category-' + guest.category">
                    {{ getCategoryLabel(guest.category) }}
                  </span>
                </td>
                <td>{{ guest.tableId ? 'Table ' + guest.tableId : 'Non assigné' }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="editGuest(guest)" title="Modifier">
                      <span class="material-icons">edit</span>
                    </button>
                    <button class="btn-icon delete" (click)="deleteGuest(guest)" title="Supprimer">
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

    <!-- Add/Edit Guest Modal -->
    <div class="modal-overlay" [class.active]="showAddModal || showEditModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Modifier' : 'Ajouter' }} un invité</h2>
          <button class="btn-close" (click)="closeModal()">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <form (ngSubmit)="saveGuest()" class="modal-body">
          <div class="form-row">
            <div class="input-group">
              <label>Prénom *</label>
              <input type="text" [(ngModel)]="currentGuest.firstName" name="firstName" required>
            </div>
            <div class="input-group">
              <label>Nom *</label>
              <input type="text" [(ngModel)]="currentGuest.lastName" name="lastName" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="input-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="currentGuest.email" name="email" required>
            </div>
            <div class="input-group">
              <label>Téléphone</label>
              <input type="tel" [(ngModel)]="currentGuest.phone" name="phone">
            </div>
          </div>
          
          <div class="form-row">
            <div class="input-group">
              <label>Catégorie</label>
              <select [(ngModel)]="currentGuest.category" name="category">
                <option value="family">Famille</option>
                <option value="friends">Amis</option>
                <option value="colleagues">Collègues</option>
                <option value="other">Autres</option>
              </select>
            </div>
            <div class="input-group">
              <label>Accompagnants</label>
              <input type="number" [(ngModel)]="currentGuest.accompanyingGuests" 
                     name="accompanyingGuests" min="0" max="5">
            </div>
          </div>
          
          <div class="input-group">
            <label>Restrictions alimentaires</label>
            <textarea [(ngModel)]="currentGuest.dietaryRestrictions" 
                      name="dietaryRestrictions" rows="3"></textarea>
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
    .guests-page {
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

    .guests-stats {
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.confirmed {
      background: #10b981;
    }

    .stat-icon.pending {
      background: #f59e0b;
    }

    .stat-icon.declined {
      background: #ef4444;
    }

    .stat-icon.total {
      background: var(--accent-color);
    }

    .stat-content h3 {
      font-size: 24px;
      margin: 0 0 4px 0;
    }

    .stat-content p {
      margin: 0;
      color: var(--text-secondary);
    }

    .guests-table {
      padding: 0;
      overflow: hidden;
    }

    .table-header {
      padding: 24px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-header h2 {
      margin: 0;
    }

    .table-actions {
      display: flex;
      gap: 16px;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box .material-icons {
      position: absolute;
      left: 12px;
      color: var(--text-light);
      font-size: 20px;
    }

    .search-box input {
      padding-left: 44px;
      width: 250px;
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

    .guest-name strong {
      display: block;
      margin-bottom: 2px;
    }

    .guest-name small {
      color: var(--text-light);
      font-size: 12px;
    }

    .status-badge,
    .category-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-confirmed {
      background: #dcfce7;
      color: #16a34a;
    }

    .status-pending {
      background: #fef3c7;
      color: #d97706;
    }

    .status-declined {
      background: #fee2e2;
      color: #dc2626;
    }

    .category-family {
      background: #f0f9ff;
      color: #0369a1;
    }

    .category-friends {
      background: #f0fdf4;
      color: #16a34a;
    }

    .category-colleagues {
      background: #fef3c7;
      color: #d97706;
    }

    .category-other {
      background: #f3f4f6;
      color: #6b7280;
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

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .table-actions {
        flex-direction: column;
        gap: 12px;
      }

      .search-box input {
        width: 100%;
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
export class GuestsComponent implements OnInit {
  guests: Guest[] = [];
  filteredGuests: Guest[] = [];
  searchTerm = '';
  filterStatus = '';
  showAddModal = false;
  showEditModal = false;
  currentGuest: Guest = this.getEmptyGuest();

  constructor(private weddingService: WeddingService) {}

  ngOnInit() {
    this.loadGuests();
  }

  loadGuests() {
    this.weddingService.getGuests().subscribe(guests => {
      this.guests = guests;
      this.filteredGuests = guests;
    });
  }

  filterGuests() {
    this.filteredGuests = this.guests.filter(guest => {
      const matchesSearch = !this.searchTerm || 
        guest.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        guest.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.filterStatus || guest.rsvpStatus === this.filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  getConfirmedCount(): number {
    return this.guests.filter(g => g.rsvpStatus === 'confirmed').length;
  }

  getPendingCount(): number {
    return this.guests.filter(g => g.rsvpStatus === 'pending').length;
  }

  getDeclinedCount(): number {
    return this.guests.filter(g => g.rsvpStatus === 'declined').length;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'declined': return 'Refusé';
      default: return status;
    }
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'family': return 'Famille';
      case 'friends': return 'Amis';
      case 'colleagues': return 'Collègues';
      case 'other': return 'Autres';
      default: return category;
    }
  }

  editGuest(guest: Guest) {
    this.currentGuest = { ...guest };
    this.showEditModal = true;
  }

  deleteGuest(guest: Guest) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${guest.firstName} ${guest.lastName} ?`)) {
      this.weddingService.deleteGuest(guest.id!).subscribe(() => {
        this.loadGuests();
      });
    }
  }

  saveGuest() {
    if (this.showEditModal) {
      this.weddingService.updateGuest(this.currentGuest).subscribe(() => {
        this.loadGuests();
        this.closeModal();
      });
    } else {
      this.weddingService.addGuest(this.currentGuest).subscribe(() => {
        this.loadGuests();
        this.closeModal();
      });
    }
  }

  closeModal() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.currentGuest = this.getEmptyGuest();
  }

  private getEmptyGuest(): Guest {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      rsvpStatus: 'pending',
      category: 'friends',
      accompanyingGuests: 0
    };
  }
}