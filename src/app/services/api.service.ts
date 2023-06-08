import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public taskList = new BehaviorSubject<any>([]);
  selectedTask = this.taskList.asObservable()
  constructor(private http: HttpClient) { }

  postTask(data: any) {
    return this.http.post<any>("http://localhost:3000/taskList/", data)
  }

  getTask() {
    return this.http.get<any>("http://localhost:3000/taskList/")
  }

  putTask(data: any, id: number) {
    return this.http.put<any>("http://localhost:3000/taskList/" + id, data)
  }

  deleteTask(id: number) {
    return this.http.delete<any>("http://localhost:3000/taskList/" + id)
  }

  editTask(row: any) {
    this.taskList.next(row)
  }
}
