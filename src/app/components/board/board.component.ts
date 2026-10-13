import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Board } from '../../models/board.model';
import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  board = signal<Board | undefined>(undefined);
  loading = signal(true);
  userName = '';
  columnIds = computed(() => this.board()?.columns.map(c => c.id.toString()) ?? []);

  constructor(
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userName = this.authService.getFullName();
  }

  ngOnInit() {
    this.loadBoard();
  }

  loadBoard() {
    this.loading.set(true);
    this.boardService.getBoards().subscribe(boards => {
      this.board.set(boards[0]);
      this.loading.set(false);
    });
  }

  // Naye user ke liye board + 3 default columns ek saath bana deta hai
  createBoard(title: string) {
    if (!title.trim()) return;

    this.boardService.createBoard(title).subscribe(newBoard => {
      const columnRequests = [
        this.boardService.createColumn('To Do', newBoard.id, 0),
        this.boardService.createColumn('In Progress', newBoard.id, 1),
        this.boardService.createColumn('Done', newBoard.id, 2)
      ];
      forkJoin(columnRequests).subscribe(() => this.loadBoard());
    });
  }

  addCard(columnId: number, title: string) {
    if (!title.trim()) return;
    const column = this.board()?.columns.find(c => c.id === columnId);
    const order = column ? column.cards.length : 0;
    this.boardService.createCard(title, columnId, order).subscribe(() => this.loadBoard());
  }

  deleteCard(cardId: number) {
    this.boardService.deleteCard(cardId).subscribe(() => this.loadBoard());
  }

  onCardDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const movedCard = event.container.data[event.currentIndex];
    const newColumnId = +event.container.id;
    this.boardService.moveCard(movedCard.id, newColumnId, event.currentIndex).subscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}