<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WeddingController;
use App\Http\Controllers\Api\GuestController;
use App\Http\Controllers\Api\TableController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\StatisticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Wedding Info Routes
Route::get('/wedding', [WeddingController::class, 'show']);
Route::put('/wedding', [WeddingController::class, 'update']);

// Guests Routes
Route::apiResource('guests', GuestController::class);

// Tables Routes
Route::apiResource('tables', TableController::class);

// Budget Routes
Route::apiResource('budgets', BudgetController::class);

// Tasks Routes
Route::apiResource('tasks', TaskController::class);

// Statistics Route
Route::get('/statistics', [StatisticsController::class, 'index']);