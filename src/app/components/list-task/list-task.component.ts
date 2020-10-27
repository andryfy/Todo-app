import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Task} from '../../models/Task';
import {MatDialog} from '@angular/material/dialog';
import {DetailsTaskComponent} from '../../dialog/details-task/details-task.component';
import * as moment from 'moment';
import {AlertRemoveComponent} from '../../dialog/alert-remove/alert-remove.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';


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
  @Output() selectedTasksOut: EventEmitter<Task[]> = new EventEmitter<Task[]>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<Task>();
  selection = new SelectionModel<Task>(true, []);

  displayedColumns: string[] = ['select', 'id', 'title', 'isDone', 'createdAt', 'doneAt', 'actions'];

  readonly moment = moment;

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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    console.log(this.selection.selected);
  }
  toggleRow(task: Task): void{
    this.selection.toggle(task);
    console.log(this.selection.selected);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Task): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
