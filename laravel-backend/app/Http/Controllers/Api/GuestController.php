<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GuestController extends Controller
{
    public function index(): JsonResponse
    {
        $guests = Guest::with('table')->get();

        return response()->json($guests->map(function ($guest) {
            return [
                'id' => $guest->id,
                'firstName' => $guest->first_name,
                'lastName' => $guest->last_name,
                'email' => $guest->email,
                'phone' => $guest->phone,
                'rsvpStatus' => $guest->rsvp_status,
                'tableId' => $guest->table_id,
                'dietaryRestrictions' => $guest->dietary_restrictions,
                'accompanyingGuests' => $guest->accompanying_guests,
                'category' => $guest->category,
                'createdAt' => $guest->created_at,
                'updatedAt' => $guest->updated_at
            ];
        }));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:guests,email',
            'phone' => 'nullable|string|max:20',
            'rsvpStatus' => 'required|in:pending,confirmed,declined',
            'tableId' => 'nullable|exists:tables,id',
            'dietaryRestrictions' => 'nullable|string',
            'accompanyingGuests' => 'nullable|integer|min:0|max:10',
            'category' => 'required|in:family,friends,colleagues,other'
        ]);

        $wedding = Wedding::first();
        if (!$wedding) {
            return response()->json(['error' => 'Wedding not found'], 404);
        }

        $guest = Guest::create([
            'wedding_id' => $wedding->id,
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'phone' => $request->phone,
            'rsvp_status' => $request->rsvpStatus,
            'table_id' => $request->tableId,
            'dietary_restrictions' => $request->dietaryRestrictions,
            'accompanying_guests' => $request->accompanyingGuests ?? 0,
            'category' => $request->category
        ]);

        return response()->json([
            'id' => $guest->id,
            'firstName' => $guest->first_name,
            'lastName' => $guest->last_name,
            'email' => $guest->email,
            'phone' => $guest->phone,
            'rsvpStatus' => $guest->rsvp_status,
            'tableId' => $guest->table_id,
            'dietaryRestrictions' => $guest->dietary_restrictions,
            'accompanyingGuests' => $guest->accompanying_guests,
            'category' => $guest->category,
            'createdAt' => $guest->created_at,
            'updatedAt' => $guest->updated_at
        ], 201);
    }

    public function show(Guest $guest): JsonResponse
    {
        return response()->json([
            'id' => $guest->id,
            'firstName' => $guest->first_name,
            'lastName' => $guest->last_name,
            'email' => $guest->email,
            'phone' => $guest->phone,
            'rsvpStatus' => $guest->rsvp_status,
            'tableId' => $guest->table_id,
            'dietaryRestrictions' => $guest->dietary_restrictions,
            'accompanyingGuests' => $guest->accompanying_guests,
            'category' => $guest->category,
            'createdAt' => $guest->created_at,
            'updatedAt' => $guest->updated_at
        ]);
    }

    public function update(Request $request, Guest $guest): JsonResponse
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:guests,email,' . $guest->id,
            'phone' => 'nullable|string|max:20',
            'rsvpStatus' => 'required|in:pending,confirmed,declined',
            'tableId' => 'nullable|exists:tables,id',
            'dietaryRestrictions' => 'nullable|string',
            'accompanyingGuests' => 'nullable|integer|min:0|max:10',
            'category' => 'required|in:family,friends,colleagues,other'
        ]);

        $guest->update([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'phone' => $request->phone,
            'rsvp_status' => $request->rsvpStatus,
            'table_id' => $request->tableId,
            'dietary_restrictions' => $request->dietaryRestrictions,
            'accompanying_guests' => $request->accompanyingGuests ?? 0,
            'category' => $request->category
        ]);

        return response()->json([
            'id' => $guest->id,
            'firstName' => $guest->first_name,
            'lastName' => $guest->last_name,
            'email' => $guest->email,
            'phone' => $guest->phone,
            'rsvpStatus' => $guest->rsvp_status,
            'tableId' => $guest->table_id,
            'dietaryRestrictions' => $guest->dietary_restrictions,
            'accompanyingGuests' => $guest->accompanying_guests,
            'category' => $guest->category,
            'createdAt' => $guest->created_at,
            'updatedAt' => $guest->updated_at
        ]);
    }

    public function destroy(Guest $guest): JsonResponse
    {
        $guest->delete();
        return response()->json(null, 204);
    }
}