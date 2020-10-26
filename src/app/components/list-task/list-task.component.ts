import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Task} from '../../models/Task';
import {MatDialog} from '@angular/material/dialog';
import {DetailsTaskComponent} from '../../dialog/details-task/details-task.component';
import * as moment from 'moment';
import {AlertRemoveComponent} from '../../dialog/alert-remove/alert-remove.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@ Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css']
})
export class ListTaskComponent implements OnInit, AfterViewInit {
  @Input() tasks: Task[];
  @Output() doneEvent: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() editEvent: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() deleteEvent: EventEmitter<Task> = new EventEmitter<Task>();
  dataSource = new MatTableDataSource<any>();

  readonly moment = moment;
  displayedColumns: string[] = ['selected', 'id', 'title', 'isDone', 'createdAt', 'doneAt', 'actions'];
  selectedTasks: Task[] = [];
  @Output() selectedTasksOut: EventEmitter<Task[]> = new EventEmitter<Task[]>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dataSource.data = this.tasks;
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  done(task: Task): void {
    if (task.isDone) { return; }
    this.doneEvent.emit(task);
  }

  remove(task: Task): void {
    const sub = this.dialog.open(AlertRemoveComponent, {data: task})
      .afterClosed().subscribe(confirm => {
        if (confirm) {
          this.deleteEvent.emit(task);
        }
      }).add(() => sub.unsubscribe());
  }

  edit(task: Task): void {
    this.editEvent.emit(task);
  }

  showMore(task: Task): void {
    this.dialog.open(DetailsTaskComponent, {
      data: task
    });
  }

  onChange(checked: boolean, task: Task): void {
    if (checked) { this.selectedTasks.push(task); }
    else { this.selectedTasks.splice(this.selectedTasks.indexOf(task), 1); }
    console.log(this.selectedTasks);
    this.selectedTasksOut.emit(this.selectedTasks);
  }
}
