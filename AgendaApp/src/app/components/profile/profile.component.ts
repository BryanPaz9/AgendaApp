import { Component, OnInit } from "@angular/core";
import { UploadService } from "src/app/services/upload.service";
import { UserService } from "src/app/services/user.service";
import { GLOBAL } from "src/app/services/global.service";
import { User } from "src/app/models/user.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, UploadService]
})
export class ProfileComponent implements OnInit {
  public identity;
  public token;
  public url;
  public status: string;
  public user: User;

  constructor(private _router: Router, private _userService: UserService, private _uploadService: UploadService) {
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
  }

  editUser() {
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) this.status = "error";
        else {
          this.status = "ok";

          sessionStorage.setItem("identity", JSON.stringify(this.user));
          this.identity = this.user;

          //SUBIR IMAGEN DEL USUARIO
          if(this.change){
            this._uploadService
            .makeFileRequest(this.url + "subir-imagen-usuario/" + this.user._id, [], this.filesToUpload, this.token, "imagen")
            .then((result: any) => {
              console.log(result);
              this.user.imagen = result.user.imagen;
              sessionStorage.setItem("identity", JSON.stringify(this.user));
              this.change = false;
              // this._router.navigate(['/home']);
            });
          }else console.log(response);
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) this.status = "error";
      }
    );
  }
  public filesToUpload: Array<File>;
  public change: boolean = false;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.change = true;
  }
}
