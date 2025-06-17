<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function index(): JsonResponse
    {
        $tasks = Task::orderBy('due_date', 'asc')->get();

        return response()->json($tasks->map(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'dueDate' => $task->due_date->format('Y-m-d'),
                'priority' => $task->priority,
                'status' => $task->status,
                'assignedTo' => $task->assigned_to,
                'category' => $task->category,
                'createdAt' => $task->created_at,
                'updatedAt' => $task->updated_at
            ];
        }));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'dueDate' => 'required|date',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:pending,in-progress,completed',
            'assignedTo' => 'nullable|string|max:255',
            'category' => 'required|in:planning,venue,catering,decoration,photography,other'
        ]);

        $wedding = Wedding::first();
        if (!$wedding) {
            return response()->json(['error' => 'Wedding not found'], 404);
        }

        $task = Task::create([
            'wedding_id' => $wedding->id,
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->dueDate,
            'priority' => $request->priority,
            'status' => $request->status,
            'assigned_to' => $request->assignedTo,
            'category' => $request->category
        ]);

        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'dueDate' => $task->due_date->format('Y-m-d'),
            'priority' => $task->priority,
            'status' => $task->status,
            'assignedTo' => $task->assigned_to,
            'category' => $task->category,
            'createdAt' => $task->created_at,
            'updatedAt' => $task->updated_at
        ], 201);
    }

    public function show(Task $task): JsonResponse
    {
        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'dueDate' => $task->due_date->format('Y-m-d'),
            'priority' => $task->priority,
            'status' => $task->status,
            'assignedTo' => $task->assigned_to,
            'category' => $task->category,
            'createdAt' => $task->created_at,
            'updatedAt' => $task->updated_at
        ]);
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'dueDate' => 'required|date',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:pending,in-progress,completed',
            'assignedTo' => 'nullable|string|max:255',
            'category' => 'required|in:planning,venue,catering,decoration,photography,other'
        ]);

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->dueDate,
            'priority' => $request->priority,
            'status' => $request->status,
            'assigned_to' => $request->assignedTo,
            'category' => $request->category
        ]);

        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'dueDate' => $task->due_date->format('Y-m-d'),
            'priority' => $task->priority,
            'status' => $task->status,
            'assignedTo' => $task->assigned_to,
            'category' => $task->category,
            'createdAt' => $task->created_at,
            'updatedAt' => $task->updated_at
        ]);
    }

    public function destroy(Task $task): JsonResponse
    {
        $task->delete();
        return response()->json(null, 204);
    }
}