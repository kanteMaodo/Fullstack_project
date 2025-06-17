<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TableController extends Controller
{
    public function index(): JsonResponse
    {
        $tables = Table::with('guests')->get();

        return response()->json($tables->map(function ($table) {
            return [
                'id' => $table->id,
                'name' => $table->name,
                'capacity' => $table->capacity,
                'occupiedSeats' => $table->guests->count(),
                'location' => $table->location,
                'notes' => $table->notes,
                'createdAt' => $table->created_at,
                'updatedAt' => $table->updated_at
            ];
        }));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1|max:20',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string'
        ]);

        $wedding = Wedding::first();
        if (!$wedding) {
            return response()->json(['error' => 'Wedding not found'], 404);
        }

        $table = Table::create([
            'wedding_id' => $wedding->id,
            'name' => $request->name,
            'capacity' => $request->capacity,
            'occupied_seats' => 0,
            'location' => $request->location,
            'notes' => $request->notes
        ]);

        return response()->json([
            'id' => $table->id,
            'name' => $table->name,
            'capacity' => $table->capacity,
            'occupiedSeats' => 0,
            'location' => $table->location,
            'notes' => $table->notes,
            'createdAt' => $table->created_at,
            'updatedAt' => $table->updated_at
        ], 201);
    }

    public function show(Table $table): JsonResponse
    {
        $table->load('guests');

        return response()->json([
            'id' => $table->id,
            'name' => $table->name,
            'capacity' => $table->capacity,
            'occupiedSeats' => $table->guests->count(),
            'location' => $table->location,
            'notes' => $table->notes,
            'guests' => $table->guests->map(function ($guest) {
                return [
                    'id' => $guest->id,
                    'firstName' => $guest->first_name,
                    'lastName' => $guest->last_name,
                    'email' => $guest->email
                ];
            }),
            'createdAt' => $table->created_at,
            'updatedAt' => $table->updated_at
        ]);
    }

    public function update(Request $request, Table $table): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1|max:20',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string'
        ]);

        $table->update([
            'name' => $request->name,
            'capacity' => $request->capacity,
            'location' => $request->location,
            'notes' => $request->notes
        ]);

        return response()->json([
            'id' => $table->id,
            'name' => $table->name,
            'capacity' => $table->capacity,
            'occupiedSeats' => $table->guests()->count(),
            'location' => $table->location,
            'notes' => $table->notes,
            'createdAt' => $table->created_at,
            'updatedAt' => $table->updated_at
        ]);
    }

    public function destroy(Table $table): JsonResponse
    {
        // Remove table assignment from guests
        $table->guests()->update(['table_id' => null]);
        
        $table->delete();
        return response()->json(null, 204);
    }
}