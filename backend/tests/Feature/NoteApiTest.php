<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Note;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NoteApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test getting all notes
     */
    public function test_can_get_all_notes(): void
    {
        Note::factory()->count(3)->create();

        $response = $this->getJson('/api/notes');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'title', 'content', 'created_at', 'updated_at']
                ]
            ]);
    }

    /**
     * Test getting a single note
     */
    public function test_can_get_single_note(): void
    {
        $note = Note::factory()->create([
            'title' => 'Test Note',
            'content' => 'Test Content'
        ]);

        $response = $this->getJson("/api/notes/{$note->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'title',
                    'content',
                    'created_at',
                    'updated_at'
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $note->id,
                    'title' => 'Test Note',
                    'content' => 'Test Content'
                ]
            ]);
    }

    /**
     * Test getting non-existent note returns 404
     */
    public function test_getting_non_existent_note_returns_404(): void
    {
        $response = $this->getJson('/api/notes/999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Resource not found',
            ]);
    }

    /**
     * Test creating a note
     */
    public function test_can_create_note(): void
    {
        $noteData = [
            'title' => 'New Note',
            'content' => 'New Note Content'
        ];

        $response = $this->postJson('/api/notes', $noteData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Note created successfully'
            ])
            ->assertJsonStructure([
                'data' => ['id', 'title', 'content', 'created_at', 'updated_at']
            ]);

        $this->assertDatabaseHas('notes', $noteData);
    }

    /**
     * Test creating note with invalid data
     */
    public function test_cannot_create_note_without_title(): void
    {
        $response = $this->postJson('/api/notes', [
            'content' => 'Content without title'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    /**
     * Test creating note with invalid data
     */
    public function test_cannot_create_note_without_content(): void
    {
        $response = $this->postJson('/api/notes', [
            'title' => 'Title without content'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }

    /**
     * Test updating a note
     */
    public function test_can_update_note(): void
    {
        $note = Note::factory()->create([
            'title' => 'Original Title',
            'content' => 'Original Content'
        ]);

        $updateData = [
            'title' => 'Updated Title',
            'content' => 'Updated Content'
        ];

        $response = $this->putJson("/api/notes/{$note->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Note updated successfully'
            ])
            ->assertJson([
                'data' => [
                    'title' => 'Updated Title',
                    'content' => 'Updated Content'
                ]
            ]);

        $this->assertDatabaseHas('notes', $updateData);
    }

    /**
     * Test updating non-existent note returns 404
     */
    public function test_updating_non_existent_note_returns_404(): void
    {
        $response = $this->putJson('/api/notes/999', [
            'title' => 'Title',
            'content' => 'Content'
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Resource not found',
            ]);
    }

    /**
     * Test deleting a note
     */
    public function test_can_delete_note(): void
    {
        $note = Note::factory()->create();

        $response = $this->deleteJson("/api/notes/{$note->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Note deleted successfully'
            ]);

        $this->assertDatabaseMissing('notes', ['id' => $note->id]);
    }

    /**
     * Test deleting non-existent note returns 404
     */
    public function test_deleting_non_existent_note_returns_404(): void
    {
        $response = $this->deleteJson('/api/notes/999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Resource not found',
            ]);
    }
}
