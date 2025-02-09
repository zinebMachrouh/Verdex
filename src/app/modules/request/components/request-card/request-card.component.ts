import {Component, EventEmitter, Input, Output} from '@angular/core';
import {formatDate, NgForOf, NgIf, NgStyle} from "@angular/common";
import {on} from "@ngrx/store";

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
  ],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.scss'
})
export class RequestCardComponent {
  @Input() request!: any;
  protected readonly formatDate = formatDate;
  @Input() isUser!: boolean;
  @Output() delete = new EventEmitter<unknown>();
  @Output() edit = new EventEmitter<unknown>();

  formatScheduleDate(schedule: any) {
    const date = new Date(schedule);
    return this.formatDate(date, 'dd MMM,yyyy', 'en-US');
  }

  formatScheduleTime(schedule: any) {
    const date = new Date(schedule);
    return this.formatDate(date, 'hh:mm a', 'en-US');
  }

  onEdit() {
    if (this.edit) {
      this.edit.emit(this.request);
    }
  }

  onDelete() {
    if (this.delete) {
      this.delete.emit(this.request.id);
    }
  }

}
