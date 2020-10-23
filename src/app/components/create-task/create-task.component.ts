import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from '../../models/Task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  formTask = {...Task.EMPTY_MODEL};
  @Output() addEvent: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() editEvent: EventEmitter<Task> = new EventEmitter<Task>();
  @Input() toEdit: Task;

  constructor() { }

  ngOnInit(): void {
  }

  addHandler() {
    if (this.toEdit) {
      this.editEvent.emit(this.toEdit);
      this.toEdit = null;
      return;
    }
    this.addEvent.emit(this.formTask);
    this.formTask = {...Task.EMPTY_MODEL};
  }

}
