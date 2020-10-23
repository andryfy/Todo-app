import {Component, OnInit, ViewChild} from '@angular/core';
import {Task} from '../../models/Task';
import {TodoService} from '../../services/todo.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  arrayOfTask: any;
  allTask: any;
  editMe: Task;

  pageSize = 10;
  currentPage = 0;
  totalSize = 0;

   @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private todoService: TodoService) {
  }

  ngOnInit(): void {
    // Recuperation des tasks depuis la base de donnee
    // Mettre les donnees dans allTask
    this.todoService.getTasks().subscribe(
      response => {
        console.log(response);
        this.allTask = new MatTableDataSource<Task>(response);
        this.allTask.paginator = this.paginator;
        this.arrayOfTask = response;
        this.totalSize = this.arrayOfTask.length;
        this.iterator();
      },
      error => {
        console.log('Get all tasks error: ', error);
      });
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.arrayOfTask.slice(start, end);
    this.allTask = part;
  }

  onAdd(newTask: Task): void {
    this.todoService.addTask(newTask).subscribe(
      response => {
        console.log(response);
        this.allTask.push({...newTask, id: response.id, createdAt: new Date()});
        this.allTask = this.allTask.filter(x => true);
      }
    );
  }

  onDone(taskToBeDone: Task): void {
    console.log(taskToBeDone);
    this.todoService.doneTask(taskToBeDone.id).subscribe(
      response => {
        taskToBeDone.isDone = true;
        taskToBeDone.doneAt = new Date();
        console.log(taskToBeDone);
      }
    );
  }


  onEdit(taskToEdit: Task): void {
        this.editMe = {...taskToEdit};
  }

  onDelete(id: number): void {
    this.todoService.removeTask(id).subscribe(
      response => {
        this.allTask = this.allTask.filter(task => task.id !== id);
      }
    );
  }

  handleEdit(editedTask: Task): void {
    const taskFound = this.allTask.find(task => task.id === editedTask.id);
    taskFound.title = editedTask.title;
    taskFound.description = editedTask.description;
    this.todoService.editTask(editedTask).subscribe();
  }

}
