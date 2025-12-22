import { API_BASE_URL } from '@/lib/utils/config';
import { TodoDTO, GetTodosResponse, mapDTOToEntity, mapDTOsToEntities } from '@/lib/types/TodoDTO';

class TodoRepository {
  async getTodos(userId: number) {
    const response = await fetch(`${API_BASE_URL}/todos/user/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }

    const data: GetTodosResponse = await response.json();
    return mapDTOsToEntities(data.todos);
  }

  async createTodo(text: string, userId: number) {
    const response = await fetch(`${API_BASE_URL}/todos/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: text,
        completed: false,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create todo');
    }

    const data: TodoDTO = await response.json();
    return mapDTOToEntity(data);
  }

  async updateTodo(id: number, text: string) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo: text }),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    const data: TodoDTO = await response.json();
    return mapDTOToEntity(data);
  }

  async deleteTodo(id: number) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  }

  async toggleTodo(id: number, completed: boolean) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle todo');
    }

    const data: TodoDTO = await response.json();
    return mapDTOToEntity(data);
  }
}

export const todoRepository = new TodoRepository();
