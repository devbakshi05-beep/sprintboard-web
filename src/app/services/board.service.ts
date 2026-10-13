import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';

const API_URL = 'https://localhost:61723/api'; // deploy ke baad Render backend URL se replace karo

@Injectable({ providedIn: 'root' })
export class BoardService {
  constructor(private http: HttpClient) {}

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${API_URL}/boards`);
  }

  createBoard(title: string): Observable<Board> {
    return this.http.post<Board>(`${API_URL}/boards`, { title });
  }

  createColumn(title: string, boardId: number, order: number) {
    return this.http.post(`${API_URL}/columns`, { title, boardId, order });
  }

  createCard(title: string, columnId: number, order: number, description?: string) {
    return this.http.post(`${API_URL}/cards`, { title, description, columnId, order });
  }

  // Ye tab call hota hai jab user card ko drag-drop karke doosre column me chhodta hai
  moveCard(cardId: number, newColumnId: number, newOrder: number) {
    return this.http.put(`${API_URL}/cards/move`, { cardId, newColumnId, newOrder });
  }

  deleteCard(cardId: number) {
    return this.http.delete(`${API_URL}/cards/${cardId}`);
  }
}
