import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';
import * as Rx from 'rxjs';
import { SocketChannel } from './SocketChannel';
import { UserList, User } from '../users';
import { Proposal, ProposalResponse } from '../proposal';
//import { environment } from '../environments/environment';

@Injectable()
export class WebsocketService {

  private socket;

  constructor() {
    //this.socket = io(environment.ws_url);
    this.socket = io("http://localhost:3000")
  }

  playerCreation(): Observable<User> {
    return this.createInputChannel(SocketChannel.PlayerCreated);
  }

  waitingRoom(): Observable<UserList> {
    return this.createInputChannel(SocketChannel.ListWaitingRoomReply);
  }

  gameProposal(): Observable<Proposal> {
    return this.createInputChannel(SocketChannel.GameProposed);
  }

  opponentResponse(): Observable<ProposalResponse> {
    return this.createInputChannel(SocketChannel.GameProposalResponse);
  }
  
  private createInputChannel<T>(channel: SocketChannel): Observable<T> {

    let observable = new Observable((observer: Subscriber<T>) => {

      this.socket.on(channel, (data) => {
        observer.next(data);
      })
      
    });

    return observable;

  }
  
  connect(): Rx.Subject<MessageEvent> {
    
    // Data emitter to server
    let observer = {
        next: (data) => {
          return this.socket.emit(data.command, JSON.stringify(data.value));
        },
    };

    return Rx.Subject.create(observer);
  }

}