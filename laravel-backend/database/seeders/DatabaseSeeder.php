<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Wedding;
use App\Models\Guest;
use App\Models\Table;
use App\Models\Budget;
use App\Models\Task;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a wedding
        $wedding = Wedding::create([
            'bride_name' => 'Amélie',
            'groom_name' => 'Thomas',
            'wedding_date' => '2024-06-15',
            'venue' => 'Château de Versailles',
            'ceremony_time' => '15:00',
            'reception_time' => '18:00',
            'estimated_guests' => 120,
            'budget' => 25000.00
        ]);

        // Create tables
        $table1 = Table::create([
            'wedding_id' => $wedding->id,
            'name' => 'Table des Familles',
            'capacity' => 8,
            'occupied_seats' => 0,
            'location' => 'Près de la scène'
        ]);

        $table2 = Table::create([
            'wedding_id' => $wedding->id,
            'name' => 'Table des Amis',
            'capacity' => 6,
            'occupied_seats' => 0,
            'location' => 'Centre de la salle'
        ]);

        $table3 = Table::create([
            'wedding_id' => $wedding->id,
            'name' => 'Table des Collègues',
            'capacity' => 8,
            'occupied_seats' => 0,
            'location' => 'Près de la terrasse'
        ]);

        // Create guests
        Guest::create([
            'wedding_id' => $wedding->id,
            'first_name' => 'Marie',
            'last_name' => 'Dupont',
            'email' => 'marie.dupont@email.com',
            'phone' => '0123456789',
            'rsvp_status' => 'confirmed',
            'table_id' => $table1->id,
            'category' => 'family',
            'accompanying_guests' => 1
        ]);

        Guest::create([
            'wedding_id' => $wedding->id,
            'first_name' => 'Pierre',
            'last_name' => 'Martin',
            'email' => 'pierre.martin@email.com',
            'phone' => '0123456788',
            'rsvp_status' => 'pending',
            'category' => 'friends',
            'accompanying_guests' => 0
        ]);

        Guest::create([
            'wedding_id' => $wedding->id,
            'first_name' => 'Sophie',
            'last_name' => 'Bernard',
            'email' => 'sophie.bernard@email.com',
            'phone' => '0123456787',
            'rsvp_status' => 'confirmed',
            'table_id' => $table2->id,
            'category' => 'colleagues',
            'accompanying_guests' => 2
        ]);

        // Create budget items
        Budget::create([
            'wedding_id' => $wedding->id,
            'category' => 'Lieu de réception',
            'estimated_amount' => 5000.00,
            'actual_amount' => 4800.00,
            'is_paid' => true,
            'vendor' => 'Château de Versailles',
            'due_date' => '2024-01-15'
        ]);

        Budget::create([
            'wedding_id' => $wedding->id,
            'category' => 'Traiteur',
            'estimated_amount' => 3000.00,
            'actual_amount' => 3200.00,
            'is_paid' => false,
            'vendor' => 'Delices & Co',
            'due_date' => '2024-02-01'
        ]);

        Budget::create([
            'wedding_id' => $wedding->id,
            'category' => 'Photographie',
            'estimated_amount' => 1500.00,
            'actual_amount' => 0.00,
            'is_paid' => false,
            'vendor' => 'Studio Photo Plus',
            'due_date' => '2024-03-01'
        ]);

        // Create tasks
        Task::create([
            'wedding_id' => $wedding->id,
            'title' => 'Réserver le lieu de réception',
            'description' => 'Confirmer la réservation et payer les arrhes',
            'due_date' => '2024-01-20',
            'priority' => 'high',
            'status' => 'completed',
            'category' => 'venue'
        ]);

        Task::create([
            'wedding_id' => $wedding->id,
            'title' => 'Choisir le menu',
            'description' => 'Rencontrer le traiteur et finaliser le menu',
            'due_date' => '2024-02-15',
            'priority' => 'high',
            'status' => 'in-progress',
            'category' => 'catering'
        ]);

        Task::create([
            'wedding_id' => $wedding->id,
            'title' => 'Envoyer les invitations',
            'description' => 'Imprimer et envoyer les faire-part',
            'due_date' => '2024-03-01',
            'priority' => 'medium',
            'status' => 'pending',
            'category' => 'planning'
        ]);
    }
}