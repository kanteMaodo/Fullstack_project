<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id')->constrained()->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->enum('rsvp_status', ['pending', 'confirmed', 'declined'])->default('pending');
            $table->foreignId('table_id')->nullable()->constrained()->onDelete('set null');
            $table->text('dietary_restrictions')->nullable();
            $table->integer('accompanying_guests')->default(0);
            $table->enum('category', ['family', 'friends', 'colleagues', 'other'])->default('friends');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};