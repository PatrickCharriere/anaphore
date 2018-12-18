import { UserList } from './../../SharedKernel/user';
import { WebsocketService } from './../../SharedKernel/WebsocketManagement/websocket.service';
import { SocketChannel } from '../../SharedKernel/WebsocketManagement/SocketChannel';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-input',
  templateUrl: './user.input.component.html',
  styleUrls: ['./user.input.component.scss']
})
export class UserInputComponent {

  private communicationSocket;
  playername = new FormControl('');
  private subscriber/*: Observable<UserList>*/;
  @Input('defaultName') defaultName: string;
  @Output() nameSubmitted = new EventEmitter<boolean>();

  constructor(private websocket: WebsocketService) {}

  ngOnInit() {
    this.communicationSocket = this.websocket.connect();
  }

  sendMessage() {
    
    this.communicationSocket.next({

      command: SocketChannel.CreatePlayer,
      value: {
        name: this.playername.value
      }

    });

    console.log('subscribe');
    
    this.subscriber = this.websocket.playerCreation().subscribe((data) => {
     
      console.log('unsubscribe');
      this.subscriber.unsubscribe();

      console.log("playerCreation", data);
      
      //this.nameSubmitted.emit(true);
    
    })
  
  }

  ngOnDestroy() {

    this.subscriber.unsubscribe();

  }

}
