<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;

Route::middleware('api')->group(function () {
    Route::apiResource('notes', NoteController::class);
});
