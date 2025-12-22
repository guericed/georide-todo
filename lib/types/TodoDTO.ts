/**
 * API types matching DummyJSON structure
 */

export interface TodoDTO {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface GetTodosResponse {
  todos: TodoDTO[];
  total: number;
  skip: number;
  limit: number;
}

export function mapDTOToEntity(dto: TodoDTO) {
  return {
    id: dto.id,
    text: dto.todo,
    isCompleted: dto.completed,
    userId: dto.userId,
  };
}

export function mapDTOsToEntities(dtos: TodoDTO[]) {
  return dtos.map(mapDTOToEntity);
}
