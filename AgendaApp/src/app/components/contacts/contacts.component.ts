import { Component, OnInit } from '@angular/core';
import { ContactService} from 'src/app/services/contact.service';
import { Contact} from 'src/app/models/contact.model';
import { UserService } from 'src/app/services/user.service';
import { UploadService} from 'src/app/services/upload.service';
import {GLOBAL} from 'src/app/services/global.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  providers: [UserService,ContactService, UploadService]
})
export class ContactsComponent implements OnInit {

  public contact:Contact;
  public identity;
  public token;
  public url: string;
  public status;
  public contacts: Contact;

  constructor(
    private _userService: UserService, 
    private _contactService: ContactService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _uploadService: UploadService
    ) {
    this.contact = new Contact("","","","","","","","",null);
    this.identity = this._userService.getIdentity;
    this.token = this._userService.getToken;
    this.url = GLOBAL.url;
   }

  ngOnInit() {
    this.getContacts();
    console.log(this.getContacts());
    //   response=>{
    //   if(response){
    //     console.log(response);
    //     this.status ='ok';
    //   }
    // },
    // error=>{
    //   console.log(<any>error);
    //   this.status = 'error';
    // }
    // );

  }

  newContact(){
    this._contactService.nuevo(this.contact).subscribe(
      response=>{
        if(response){
          console.log(response);
          this.status = 'ok';
          this._router.navigate(['/contacts']);
          this.getContacts();
        }
      },
      error=>{
        console.log(<any>error);
        this.status = 'error';
        this._router.navigate(['/contacts']);
      }
    )
  }

  getContacts(){
    this._contactService.getContacts().subscribe( res=>{
      this.contacts = res.contactoFind;
      console.log(res.contactoFind);
      console.log(this.contact._id);
    });
  }

  getContact(id){
    // this._route.params.forEach((params:Params)=>{
    //   let id = params['id'];

      this._contactService.getContact(id).subscribe(
        response=>{
          if(!response.contacto){
            console.log('no existe');
          }else{
            this.contact = response.contacto;
            console.log(this.contact);
          }
        },
        error=>{
          console.log(<any>error);
        }
      )
    // }); 
  }

  congratMail(){
    console.log("Felicidades!");
  }
  editContact(id){
    this._contactService.updateContact(id, this.contact).subscribe(
      response=>{
        if(!response.contact) this.status = "error"
        else{
          this.status = "ok";
          this.getContacts();
          console.log(this.getContact(this.contact._id));
          sessionStorage.setItem("identity", JSON.stringify(this.contact));
          // this.identity = this.contact;

     //     SUB IMG CONTACT
          if(this.change){
            this._uploadService
            .makeFileRequest(this.url + "subir-imagen-contacto/" +  id, [], this.filesToUpload, this.token, "imagen")
            .then((result: any) => {
              console.log(result);
              // this.contact.imagen = result.contact.imagen;
              // sessionStorage.setItem("identity", JSON.stringify(this.contact));
              this.getContacts();
              this.change = false;
              // this._router.navigate(['/home']);
            });
          }else console.log(response);
        }
        this.getContacts();
      },
      error=>{

      }
    );
  }

  deleteContact(id){
    this._contactService.deleteContact(id).subscribe(
      response=>{
        if(!response.task) this.status = "error"
        else{
          this.status = "ok";
          this.getContacts();
        }
        this._router.navigate(['/contacts']);
        this.getContacts();
      },
      error=>{
        console.log(<any>error);
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
