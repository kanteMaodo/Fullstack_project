<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BudgetController extends Controller
{
    public function index(): JsonResponse
    {
        $budgets = Budget::all();

        return response()->json($budgets->map(function ($budget) {
            return [
                'id' => $budget->id,
                'category' => $budget->category,
                'estimatedAmount' => $budget->estimated_amount,
                'actualAmount' => $budget->actual_amount,
                'isPaid' => $budget->is_paid,
                'dueDate' => $budget->due_date?->format('Y-m-d'),
                'vendor' => $budget->vendor,
                'description' => $budget->description,
                'createdAt' => $budget->created_at,
                'updatedAt' => $budget->updated_at
            ];
        }));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'category' => 'required|string|max:255',
            'estimatedAmount' => 'required|numeric|min:0',
            'actualAmount' => 'nullable|numeric|min:0',
            'isPaid' => 'boolean',
            'dueDate' => 'nullable|date',
            'vendor' => 'nullable|string|max:255',
            'description' => 'nullable|string'
        ]);

        $wedding = Wedding::first();
        if (!$wedding) {
            return response()->json(['error' => 'Wedding not found'], 404);
        }

        $budget = Budget::create([
            'wedding_id' => $wedding->id,
            'category' => $request->category,
            'estimated_amount' => $request->estimatedAmount,
            'actual_amount' => $request->actualAmount ?? 0,
            'is_paid' => $request->isPaid ?? false,
            'due_date' => $request->dueDate,
            'vendor' => $request->vendor,
            'description' => $request->description
        ]);

        return response()->json([
            'id' => $budget->id,
            'category' => $budget->category,
            'estimatedAmount' => $budget->estimated_amount,
            'actualAmount' => $budget->actual_amount,
            'isPaid' => $budget->is_paid,
            'dueDate' => $budget->due_date?->format('Y-m-d'),
            'vendor' => $budget->vendor,
            'description' => $budget->description,
            'createdAt' => $budget->created_at,
            'updatedAt' => $budget->updated_at
        ], 201);
    }

    public function show(Budget $budget): JsonResponse
    {
        return response()->json([
            'id' => $budget->id,
            'category' => $budget->category,
            'estimatedAmount' => $budget->estimated_amount,
            'actualAmount' => $budget->actual_amount,
            'isPaid' => $budget->is_paid,
            'dueDate' => $budget->due_date?->format('Y-m-d'),
            'vendor' => $budget->vendor,
            'description' => $budget->description,
            'createdAt' => $budget->created_at,
            'updatedAt' => $budget->updated_at
        ]);
    }

    public function update(Request $request, Budget $budget): JsonResponse
    {
        $request->validate([
            'category' => 'required|string|max:255',
            'estimatedAmount' => 'required|numeric|min:0',
            'actualAmount' => 'nullable|numeric|min:0',
            'isPaid' => 'boolean',
            'dueDate' => 'nullable|date',
            'vendor' => 'nullable|string|max:255',
            'description' => 'nullable|string'
        ]);

        $budget->update([
            'category' => $request->category,
            'estimated_amount' => $request->estimatedAmount,
            'actual_amount' => $request->actualAmount ?? 0,
            'is_paid' => $request->isPaid ?? false,
            'due_date' => $request->dueDate,
            'vendor' => $request->vendor,
            'description' => $request->description
        ]);

        return response()->json([
            'id' => $budget->id,
            'category' => $budget->category,
            'estimatedAmount' => $budget->estimated_amount,
            'actualAmount' => $budget->actual_amount,
            'isPaid' => $budget->is_paid,
            'dueDate' => $budget->due_date?->format('Y-m-d'),
            'vendor' => $budget->vendor,
            'description' => $budget->description,
            'createdAt' => $budget->created_at,
            'updatedAt' => $budget->updated_at
        ]);
    }

    public function destroy(Budget $budget): JsonResponse
    {
        $budget->delete();
        return response()->json(null, 204);
    }
}