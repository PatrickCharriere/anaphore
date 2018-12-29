import { WebsocketService } from '../../SharedKernel/WebsocketManagement/websocket.service';
import { SocketChannel } from '../../SharedKernel/WebsocketManagement/SocketChannel';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/SharedKernel/user.service';

@Component({
  selector: 'app-user-input',
  templateUrl: './user.input.component.html',
  styleUrls: ['./user.input.component.scss']
})
export class UserInputComponent {

  private communicationSocket;
  playername = new FormControl('');
  private subscriber;
  @Input('defaultName') defaultName: string;
  @Output() nameSubmitted = new EventEmitter<boolean>();

  constructor(private websocket: WebsocketService,
    private user: UserService) {}

  ngOnInit() {

    this.communicationSocket = this.websocket.connect()
    
  }

  sendMessage() {
    
    this.communicationSocket.next({

      command: SocketChannel.CreatePlayer,
      value: {
        name: this.playername.value
      }

    });

    this.subscriber = this.websocket.playerCreation().subscribe((user) => {
     
      this.subscriber.unsubscribe()
    
      this.user.set(user)

      this.nameSubmitted.emit(true)
    
    });
  
  }

  ngOnDestroy() {

    if (this.subscriber) this.subscriber.unsubscribe()

  }

}
