import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['checkbox', 'task', 'duedate', 'action'];
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  numSelected: any;
  statusForm !: FormGroup
  isChecked: boolean = false;

  statuses: any[] = [
    { value: 'completed', viewValue: 'Completed' },
    { value: 'pending', viewValue: 'Pending' },
    { value: 'both', viewValue: 'Both' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.getAllTask();
    this.statusForm = this.formBuilder.group({
      status: ['']
    })
  }

  getAllTask() {
    this.api.getTask()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
        }
      })
  }

  editTask(row: any) {
    this.router.navigate(["/add-task"]);
    this.api.editTask(row)
  }

  deleteTask(id: any) {
    this.api.deleteTask(id)
      .subscribe({
        next: (res) => {
          this.getAllTask()
        },
        error: () => {
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getSelectValue(event: any) {
    this.api.getTask()
      .subscribe({
        next: (res) => {
          const taskList = res
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          taskList.forEach((a: any) => {
            Object.assign(a, { status: this.statusForm.value.status.concat(), })
          })
          console.log(res, "res")
        }
      })
  }

  isAllSelected() {
    this.numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return this.numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
}
