import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout">
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <div class="logo">
            <span class="material-icons">favorite</span>
            <h2>WeddingPlan</h2>
          </div>
          <button class="sidebar-toggle" (click)="toggleSidebar()">
            <span class="material-icons">{{ sidebarOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" 
             routerLinkActive="active"
             class="nav-item">
            <span class="material-icons">dashboard</span>
            <span>Tableau de bord</span>
          </a>
          <a routerLink="/guests" 
             routerLinkActive="active"
             class="nav-item">
            <span class="material-icons">people</span>
            <span>Invités</span>
          </a>
          <a routerLink="/tables" 
             routerLinkActive="active"
             class="nav-item">
            <span class="material-icons">table_restaurant</span>
            <span>Tables</span>
          </a>
          <a routerLink="/budget" 
             routerLinkActive="active"
             class="nav-item">
            <span class="material-icons">account_balance_wallet</span>
            <span>Budget</span>
          </a>
          <a routerLink="/tasks" 
             routerLinkActive="active"
             class="nav-item">
            <span class="material-icons">task_alt</span>
            <span>Tâches</span>
          </a>
        </nav>
      </aside>

      <main class="main-content">
        <header class="header">
          <button class="menu-toggle" (click)="toggleSidebar()">
            <span class="material-icons">menu</span>
          </button>
          <h1>{{ pageTitle }}</h1>
          <div class="header-actions">
            <button class="btn btn-primary">
              <span class="material-icons">add</span>
              Nouveau
            </button>
          </div>
        </header>
        
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
    
    <div class="sidebar-overlay" 
         [class.active]="sidebarOpen" 
         (click)="closeSidebar()"></div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 280px;
      background: linear-gradient(135deg, var(--primary-color), #f0d0d0);
      border-right: 1px solid var(--border-color);
      position: fixed;
      top: 0;
      left: -280px;
      height: 100%;
      z-index: 1000;
      transition: var(--transition);
      overflow-y: auto;
    }

    .sidebar.open {
      left: 0;
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-primary);
    }

    .logo .material-icons {
      font-size: 28px;
      color: var(--accent-color);
    }

    .logo h2 {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      margin: 0;
    }

    .sidebar-toggle {
      background: none;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: var(--transition);
      display: none;
    }

    .sidebar-toggle:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .sidebar-nav {
      padding: 20px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      color: var(--text-primary);
      text-decoration: none;
      transition: var(--transition);
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      border-left-color: var(--accent-color);
    }

    .nav-item.active {
      background: rgba(255, 107, 157, 0.1);
      border-left-color: var(--accent-color);
      color: var(--accent-color);
      font-weight: 500;
    }

    .nav-item .material-icons {
      font-size: 20px;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 0;
      transition: var(--transition);
    }

    .header {
      background: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: var(--shadow);
    }

    .menu-toggle {
      background: none;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: var(--transition);
    }

    .menu-toggle:hover {
      background: var(--background-color);
    }

    .header h1 {
      font-size: 24px;
      margin: 0;
      flex: 1;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      background: var(--background-color);
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: var(--transition);
    }

    .sidebar-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    @media (min-width: 1024px) {
      .sidebar {
        position: relative;
        left: 0;
      }

      .sidebar-toggle,
      .menu-toggle {
        display: none;
      }

      .sidebar-overlay {
        display: none;
      }
    }

    @media (max-width: 1023px) {
      .sidebar-toggle {
        display: block;
      }
    }

    @media (max-width: 768px) {
      .header {
        padding: 12px 16px;
      }

      .header h1 {
        font-size: 20px;
      }

      .content {
        padding: 16px;
      }

      .sidebar {
        width: 100%;
        left: -100%;
      }

      .sidebar.open {
        left: 0;
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  sidebarOpen = false;
  pageTitle = 'Tableau de bord';

  private pageTitles: { [key: string]: string } = {
    '/dashboard': 'Tableau de bord',
    '/guests': 'Gestion des invités',
    '/tables': 'Gestion des tables',
    '/budget': 'Gestion du budget',
    '/tasks': 'Gestion des tâches'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.pageTitle = this.pageTitles[event.url] || 'WeddingPlan';
      });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}