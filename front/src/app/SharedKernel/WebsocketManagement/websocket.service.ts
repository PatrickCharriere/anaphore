import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { methodNames } from './method_names';
//import { environment } from '../environments/environment';

@Injectable()
export class WebsocketService {

  private socket;

  constructor() { }


  
  private subscribe(channel: methodNames) {
    
  }
  
  connect(): Rx.Subject<MessageEvent> {
    //this.socket = io(environment.ws_url);
    this.socket = io("http://localhost:3000");

    // Collect messages from server
    let observable = new Observable(observer => {
        this.socket.on('message', (data) => {
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });
    
    // Emit data to server
    let observer = {
        next: (data) => {
          console.log(data);
          return this.socket.emit(data.command, JSON.stringify(data.value));
        },
    };

    return Rx.Subject.create(observer, observable);
  }

}