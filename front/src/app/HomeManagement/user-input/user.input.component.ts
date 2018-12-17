import { SocketChannel } from './../../../../../shared/SocketChannel';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WebsocketService } from '../../SharedKernel/WebsocketManagement/websocket.service';

@Component({
  selector: 'app-user-input',
  templateUrl: './user.input.component.html',
  styleUrls: ['./user.input.component.scss']
})
export class UserInputComponent {
  playername = new FormControl('');
  @Input('defaultName') defaultName: string;
  @Input('communicationSocket') communicationSocket;
  @Output() nameSubmitted = new EventEmitter<boolean>();

  constructor(){ }

  ngOnInit() {}

  sendMessage() {
    this.communicationSocket.next({
      command: SocketChannel.CreatePlayer,
      value: {name: this.playername.value}
    });
    this.nameSubmitted.emit(true);
  }

}
