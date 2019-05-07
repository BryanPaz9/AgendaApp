import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpHandler } from '@angular/common/http';
import { GLOBAL } from './global.service';
import { Task} from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable()

export class TaskService {
  public url: string;
  public identity;
  public token;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
   }

  nuevo(task: Task) {
    let params = JSON.stringify(task);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    return this._http.post(this.url + 'new-task', params, { headers: headers });
  }

  getTasks(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    return this._http.get(this.url + 'list-tasks', { headers: headers });
  }

  getTask(id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    return this._http.get(this.url + 'get-task/' + id, { headers: headers });
  }

  getIdentity() {
    var identity2 = JSON.parse(sessionStorage.getItem('identity'));
    if (identity2 != "undefined") this.identity = identity2;
    else this.identity = null;
    return this.identity;
  }

  updateTask(id, task): Observable<any> {
    let params = JSON.stringify(task);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    return this._http.put(this.url + 'edit-task/' + id, params, { headers: headers });
  }

  deleteTask(id): Observable<any>{
    // let params = JSON.stringify(task);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',this.getToken());
    return this._http.delete(this.url+'delete-task/'+id,{headers: headers});
  }

   getToken(){
    var token2 = sessionStorage.getItem('token');
    if(token2 != "undefined") this.token = token2;
    else this.token = null;
    return this.token;
  }
}
