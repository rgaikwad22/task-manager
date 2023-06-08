import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  addTaskForm !: FormGroup
  actionBtn: string = "Add Task";
  editData: any;

  task = new FormControl('', [Validators.required, Validators.minLength(3)])
  duedate = new FormControl('', Validators.required)

  public checkError = (controlName: string, errorName: string) => {
    return this.addTaskForm.controls[controlName].hasError(errorName);
  }

  constructor(private formBuilder: FormBuilder, private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.addTaskForm = this.formBuilder.group({
      task: this.task,
      duedate: this.duedate
    });

    this.api.selectedTask.subscribe((value) => {
      this.editData = value
      if (value.length === 0) {
        this.actionBtn = "Add Task"
      } else {
        this.actionBtn = "Update"
        this.addTaskForm.controls['task'].setValue(value.task)
        this.addTaskForm.controls['duedate'].setValue(value.duedate)
      }
    })

  }

  updateTask() {
    this.api.putTask(this.addTaskForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          console.log("Task updated");
          this.addTaskForm.reset();
          this.router.navigate(["/task-list"]);
        },
        error: () => {
          console.log("Error while updating the record!")
        }
      })
  }

  addTask() {
    if (this.editData.length === 0) {
      if (this.addTaskForm.valid) {
        this.api.postTask(this.addTaskForm.value)
          .subscribe({
            next: () => {
              this.addTaskForm.reset();
              this.router.navigate(["/task-list"]);
            },
            error: () => {
            }
          })
      }
    } else {
      this.updateTask();
    }
  }
}