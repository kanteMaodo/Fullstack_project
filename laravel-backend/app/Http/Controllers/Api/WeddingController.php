<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WeddingController extends Controller
{
    public function show(): JsonResponse
    {
        $wedding = Wedding::first();
        
        if (!$wedding) {
            // Create default wedding if none exists
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
        }

        return response()->json([
            'id' => $wedding->id,
            'brideName' => $wedding->bride_name,
            'groomName' => $wedding->groom_name,
            'weddingDate' => $wedding->wedding_date->format('Y-m-d'),
            'venue' => $wedding->venue,
            'ceremonyTime' => $wedding->ceremony_time,
            'receptionTime' => $wedding->reception_time,
            'estimatedGuests' => $wedding->estimated_guests,
            'budget' => $wedding->budget,
            'createdAt' => $wedding->created_at,
            'updatedAt' => $wedding->updated_at
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'brideName' => 'required|string|max:255',
            'groomName' => 'required|string|max:255',
            'weddingDate' => 'required|date',
            'venue' => 'required|string|max:255',
            'ceremonyTime' => 'required|string',
            'receptionTime' => 'required|string',
            'estimatedGuests' => 'required|integer|min:1',
            'budget' => 'required|numeric|min:0'
        ]);

        $wedding = Wedding::first();
        
        if (!$wedding) {
            $wedding = new Wedding();
        }

        $wedding->update([
            'bride_name' => $request->brideName,
            'groom_name' => $request->groomName,
            'wedding_date' => $request->weddingDate,
            'venue' => $request->venue,
            'ceremony_time' => $request->ceremonyTime,
            'reception_time' => $request->receptionTime,
            'estimated_guests' => $request->estimatedGuests,
            'budget' => $request->budget
        ]);

        return response()->json([
            'id' => $wedding->id,
            'brideName' => $wedding->bride_name,
            'groomName' => $wedding->groom_name,
            'weddingDate' => $wedding->wedding_date->format('Y-m-d'),
            'venue' => $wedding->venue,
            'ceremonyTime' => $wedding->ceremony_time,
            'receptionTime' => $wedding->reception_time,
            'estimatedGuests' => $wedding->estimated_guests,
            'budget' => $wedding->budget,
            'createdAt' => $wedding->created_at,
            'updatedAt' => $wedding->updated_at
        ]);
    }
}