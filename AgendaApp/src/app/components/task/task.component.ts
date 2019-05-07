import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import {Task} from 'src/app/models/task.model';
import {GLOBAL} from 'src/app/services/global.service';
import {Router} from  "@angular/router";
import {UserService} from 'src/app/services/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  providers:[ TaskService, UserService]
})
export class TaskComponent implements OnInit {
  public task: Task;
  public identity;
  public token;
  public url: string;
  public status;
  public tasks: Task;

  constructor(
    private _userService: UserService, 
    private _taskService: TaskService,
    private _router: Router
    // private _route: ActivatedRoute,
    // private _uploadService: UploadService
  ) { 
    this.task = new Task("","","","","","","");
    this.identity = this._userService.getIdentity;
    this.token = this._userService.getToken;
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.getTasks();
  }

  newTask(){
    this._taskService.nuevo(this.task).subscribe(
      response=>{
        if(response){
          console.log(response);
          this.status = 'ok';
          this._router.navigate(['/tasks']);
          this.getTasks();
        }
      },
      error=>{
        console.log(<any>error);
        this.status = 'error';
        this._router.navigate(['/tasks']);
      }
    )
  }
  getTasks(){
    this._taskService.getTasks().subscribe( res=>{
      this.tasks = res.tasks;
      console.log(res.tasks);
      console.log(this.task._id);
    });
  }

  getTask(id){
    // this._route.params.forEach((params:Params)=>{
    //   let id = params['id'];

      this._taskService.getTask(id).subscribe(
        response=>{
          if(!response.tarea){
            console.log('no existe');
          }else{
            this.task = response.tarea;
            console.log(this.task);
          }
        },
        error=>{
          console.log(<any>error);
        }
      )
    // }); 
  }

  editTask(id){
    this._taskService.updateTask(id, this.task).subscribe(
      response=>{
        if(!response.task) this.status = "error"
        else{
          this.status = "ok";
          this.getTasks();
          console.log(this.getTask(this.task._id));
          
          sessionStorage.setItem("identity", JSON.stringify(this.task));
          // this.identity = this.contact;

     //     SUB IMG CONTACT
          // if(this.change){
          //   this._uploadService
          //   .makeFileRequest(this.url + "subir-imagen-contacto/" +  id, [], this.filesToUpload, this.token, "imagen")
          //   .then((result: any) => {
          //     console.log(result);
          //     // this.contact.imagen = result.contact.imagen;
          //     // sessionStorage.setItem("identity", JSON.stringify(this.contact));
          //     this.getContacts();
          //     this.change = false;
          //     // this._router.navigate(['/home']);
          //   });
          // }else console.log(response);
        }
        this.getTasks();
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  deleteTask(id){
    this._taskService.deleteTask(id).subscribe(
      response=>{
        if(!response.task) this.status = "error"
        else{
          this.status = "ok";
          this.getTasks();
        }
        this._router.navigate(['/tasks']);
        this.getTasks();
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

}
