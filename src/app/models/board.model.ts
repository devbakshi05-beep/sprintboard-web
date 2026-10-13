// Ye interfaces backend ke C# models se match karte hain (Board, BoardColumn, TaskCard)

export interface TaskCard {
  id: number;
  title: string;
  description?: string;
  order: number;
  columnId: number;
}

export interface BoardColumn {
  id: number;
  title: string;
  order: number;
  boardId: number;
  cards: TaskCard[];
}

export interface Board {
  id: number;
  title: string;
  columns: BoardColumn[];
}
