import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Guest, Table, Budget, Task, WeddingInfo } from '../models/wedding.models';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {
  private currentWeddingSubject = new BehaviorSubject<WeddingInfo | null>(null);
  public currentWedding$ = this.currentWeddingSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // Wedding Info
  getWeddingInfo(): Observable<WeddingInfo> {
    return this.apiService.get<WeddingInfo>('wedding');
  }

  updateWeddingInfo(wedding: WeddingInfo): Observable<WeddingInfo> {
    return this.apiService.put<WeddingInfo>('wedding', wedding);
  }

  // Guests
  getGuests(): Observable<Guest[]> {
    return this.apiService.get<Guest[]>('guests');
  }

  addGuest(guest: Guest): Observable<Guest> {
    return this.apiService.post<Guest>('guests', guest);
  }

  updateGuest(guest: Guest): Observable<Guest> {
    return this.apiService.put<Guest>(`guests/${guest.id}`, guest);
  }

  deleteGuest(id: number): Observable<void> {
    return this.apiService.delete<void>(`guests/${id}`);
  }

  // Tables
  getTables(): Observable<Table[]> {
    return this.apiService.get<Table[]>('tables');
  }

  addTable(table: Table): Observable<Table> {
    return this.apiService.post<Table>('tables', table);
  }

  updateTable(table: Table): Observable<Table> {
    return this.apiService.put<Table>(`tables/${table.id}`, table);
  }

  deleteTable(id: number): Observable<void> {
    return this.apiService.delete<void>(`tables/${id}`);
  }

  // Budget
  getBudgets(): Observable<Budget[]> {
    return this.apiService.get<Budget[]>('budgets');
  }

  addBudget(budget: Budget): Observable<Budget> {
    return this.apiService.post<Budget>('budgets', budget);
  }

  updateBudget(budget: Budget): Observable<Budget> {
    return this.apiService.put<Budget>(`budgets/${budget.id}`, budget);
  }

  deleteBudget(id: number): Observable<void> {
    return this.apiService.delete<void>(`budgets/${id}`);
  }

  // Tasks
  getTasks(): Observable<Task[]> {
    return this.apiService.get<Task[]>('tasks');
  }

  addTask(task: Task): Observable<Task> {
    return this.apiService.post<Task>('tasks', task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.apiService.put<Task>(`tasks/${task.id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.apiService.delete<void>(`tasks/${id}`);
  }

  // Statistics
  getStatistics(): Observable<any> {
    return this.apiService.get<any>('statistics');
  }
}