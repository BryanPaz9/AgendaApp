import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global.service';
import { Contact} from '../models/contact.model';
import { Observable } from 'rxjs';

@Injectable()

export class ContactService {
    public url: string;
    public identity;
    public token;

    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
    }

    nuevo(contact: Contact){
        let params = JSON.stringify(contact);
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', this.getToken());
        return this._http.post(this.url+'new-contact', params, {headers: headers});
    }

    getIdentity(){
        var identity2 = JSON.parse(sessionStorage.getItem('identity'));
        if(identity2 != "undefined") this.identity = identity2;
        else this.identity = null;
        return this.identity;
    }

    getToken(){
        var token2 = sessionStorage.getItem('token');
        if(token2 != "undefined") this.token = token2;
        else this.token = null;
        return this.token;
      }

    updateContact(id, contact): Observable<any>{
        let params = JSON.stringify(contact);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
        return this._http.put(this.url+'edit-contact/'+id, params, {headers: headers});
    }

    getContacts(): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
        return this._http.get(this.url+'list-contacts',{headers: headers});
    }
    getContact(id): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
        return this._http.get(this.url+'get-contacto/'+id,{headers: headers});
    }

    deleteContact(id): Observable<any>{
        // let params = JSON.stringify(task);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',this.getToken());
        return this._http.delete(this.url+'delete-contact/'+id,{headers: headers});
      }
}

