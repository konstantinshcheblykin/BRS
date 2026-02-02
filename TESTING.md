# Руководство по тестированию API

## Расположение тестов

API тесты находятся в файле:
```
backend/tests/Feature/NoteApiTest.php
```

## Структура тестов

Тесты реализованы с использованием PHPUnit и Laravel Testing Framework. Класс `NoteApiTest` содержит тесты для всех 5 методов API.

### Реализованные тесты:

1. **test_can_get_all_notes** - получение всех заметок
2. **test_can_get_single_note** - получение одной заметки по ID
3. **test_getting_non_existent_note_returns_404** - обработка ошибки 404
4. **test_can_create_note** - создание новой заметки
5. **test_cannot_create_note_without_title** - валидация: отсутствие title
6. **test_cannot_create_note_without_content** - валидация: отсутствие content
7. **test_can_update_note** - обновление заметки
8. **test_updating_non_existent_note_returns_404** - обновление несуществующей заметки
9. **test_can_delete_note** - удаление заметки
10. **test_deleting_non_existent_note_returns_404** - удаление несуществующей заметки

## Как реализовано

### 1. Использование RefreshDatabase

```php
use RefreshDatabase;
```

Этот трейт автоматически:
- Создает тестовую БД перед каждым тестом
- Выполняет миграции
- Очищает БД после каждого теста

### 2. Фабрики для создания тестовых данных

Используется `NoteFactory` для генерации тестовых заметок:

```php
Note::factory()->create([
    'title' => 'Test Note',
    'content' => 'Test Content'
]);
```

### 3. HTTP методы для тестирования API

Laravel предоставляет удобные методы:
- `$this->getJson('/api/notes')` - GET запрос
- `$this->postJson('/api/notes', $data)` - POST запрос
- `$this->putJson('/api/notes/1', $data)` - PUT запрос
- `$this->deleteJson('/api/notes/1')` - DELETE запрос

### 4. Assertions (проверки)

Используются различные проверки:
- `assertStatus(200)` - проверка HTTP статуса
- `assertJson(['success' => true])` - проверка JSON структуры
- `assertJsonStructure([...])` - проверка структуры JSON
- `assertJsonValidationErrors(['title'])` - проверка ошибок валидации
- `assertDatabaseHas('notes', $data)` - проверка наличия данных в БД
- `assertDatabaseMissing('notes', ['id' => 1])` - проверка отсутствия данных

## Как запускать тесты

### Вариант 1: Через Docker (рекомендуется)

```bash
# Запустить все тесты
docker compose exec backend php artisan test

# Или через PHPUnit напрямую
docker compose exec backend vendor/bin/phpunit
```

### Вариант 2: Запуск конкретного теста

```bash
# Запустить только тесты для Note API
docker compose exec backend php artisan test --filter NoteApiTest

# Запустить конкретный тест
docker compose exec backend php artisan test --filter test_can_create_note
```

### Вариант 3: С подробным выводом

```bash
# С подробным выводом
docker compose exec backend vendor/bin/phpunit --verbose

# С покрытием кода (если установлен)
docker compose exec backend vendor/bin/phpunit --coverage-html coverage
```

### Вариант 4: Локально (без Docker)

Если у вас установлен PHP и Composer локально:

```bash
cd backend
composer install
php artisan test
```

## Конфигурация тестов

Настройки тестов находятся в `backend/phpunit.xml`:

- **База данных**: Используется SQLite в памяти (`:memory:`) для быстрого выполнения
- **Окружение**: `APP_ENV=testing`
- **Кэш**: `array` (в памяти)
- **Сессии**: `array` (в памяти)

## Пример выполнения теста

```bash
$ docker compose exec backend php artisan test --filter test_can_create_note

   PASS  Tests\Feature\NoteApiTest
  ✓ can create note

  Tests:    1 passed
  Duration: 0.45s
```

## Добавление новых тестов

Для добавления нового теста в `NoteApiTest.php`:

```php
public function test_your_test_name(): void
{
    // Arrange - подготовка данных
    $note = Note::factory()->create();
    
    // Act - выполнение действия
    $response = $this->getJson("/api/notes/{$note->id}");
    
    // Assert - проверка результата
    $response->assertStatus(200)
        ->assertJson([
            'success' => true
        ]);
}
```

## Полезные команды

```bash
# Запустить все тесты с остановкой на первой ошибке
docker compose exec backend php artisan test --stop-on-failure

# Запустить тесты с фильтром по группе
docker compose exec backend php artisan test --group api

# Показать список всех тестов
docker compose exec backend vendor/bin/phpunit --list-tests
```

## Отладка тестов

Если тест не проходит, можно использовать:

```php
// Вывести содержимое ответа
$response->dump();

// Вывести JSON ответ
dd($response->json());

// Проверить содержимое БД
dd(Note::all());
```

## Покрытие кода

Для проверки покрытия кода тестами (требует установки расширения):

```bash
docker compose exec backend vendor/bin/phpunit --coverage-text
docker compose exec backend vendor/bin/phpunit --coverage-html coverage
```
