<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Table;
use App\Models\Budget;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class StatisticsController extends Controller
{
    public function index(): JsonResponse
    {
        $guests = Guest::all();
        $tables = Table::all();
        $budgets = Budget::all();
        $tasks = Task::all();

        $confirmedGuests = $guests->where('rsvp_status', 'confirmed')->count();
        $pendingGuests = $guests->where('rsvp_status', 'pending')->count();
        $declinedGuests = $guests->where('rsvp_status', 'declined')->count();

        $totalBudget = $budgets->sum('estimated_amount');
        $spentBudget = $budgets->sum('actual_amount');
        $remainingBudget = $totalBudget - $spentBudget;

        $completedTasks = $tasks->where('status', 'completed')->count();
        $inProgressTasks = $tasks->where('status', 'in-progress')->count();
        $pendingTasks = $tasks->where('status', 'pending')->count();

        $totalCapacity = $tables->sum('capacity');
        $occupiedSeats = $guests->whereNotNull('table_id')->count();

        return response()->json([
            'totalGuests' => $guests->count(),
            'confirmedGuests' => $confirmedGuests,
            'pendingGuests' => $pendingGuests,
            'declinedGuests' => $declinedGuests,
            'totalTables' => $tables->count(),
            'totalCapacity' => $totalCapacity,
            'occupiedSeats' => $occupiedSeats,
            'availableSeats' => $totalCapacity - $occupiedSeats,
            'totalBudget' => $totalBudget,
            'spentBudget' => $spentBudget,
            'remainingBudget' => $remainingBudget,
            'budgetPercentage' => $totalBudget > 0 ? round(($spentBudget / $totalBudget) * 100, 2) : 0,
            'totalTasks' => $tasks->count(),
            'completedTasks' => $completedTasks,
            'inProgressTasks' => $inProgressTasks,
            'pendingTasks' => $pendingTasks,
            'tasksCompletionPercentage' => $tasks->count() > 0 ? round(($completedTasks / $tasks->count()) * 100, 2) : 0
        ]);
    }
}