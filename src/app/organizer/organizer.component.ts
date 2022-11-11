import { Component, OnInit } from '@angular/core';
import { DateService } from '../shared/date.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Task, TasksService } from '../shared/tasks.service';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required)
  });
  tasks: Task[] = [];

  constructor(public dateService: DateService,
              private tasksService: TasksService) { }

  ngOnInit(): void {
    this.dateService.selected.pipe(switchMap(value => this.tasksService.load(value)))
                         .subscribe(tasks => {
                            this.tasks = tasks;
                         });
  }

  submit() {
    const {title} = this.form.value;

    const task: Task = {
      title,
      date: this.dateService.selected.value.format(environment.dbDateFormat)
    };
    
    this.tasksService.create(task)
                     .subscribe({
                        next: task => {
                          this.tasks.push(task);
                          this.form.reset();
                        },
                        error: error => console.error(error)
                      });
  }

  remove(task: Task) {
    this.tasksService.remove(task)
                     .subscribe({
                      next: () => {
                        this.tasks = this.tasks.filter(t => t.id !== task.id);
                      },
                      error: e => console.error(e)
                     })
  }
}
