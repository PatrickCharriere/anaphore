import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../SharedKernel/user';
import { WebsocketService } from 'src/app/SharedKernel/WebsocketManagement/websocket.service';
import { SocketChannel } from 'src/app/SharedKernel/WebsocketManagement/SocketChannel';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  _userList: User[]
  @Input('userList')
  set userList(userList: User[]) {
    this._userList = userList;
  }

  private communicationSocket;

  constructor(private websocket: WebsocketService) {}

  ngOnInit() {
    
    this.communicationSocket = this.websocket.connect();

    this.communicationSocket.next({
      command: SocketChannel.ListWaitingRoomRequest,
    });

  }

  sendMessage() {
    /*this.communicationSocket.next({
      command: 'startGame',
    });
    this.playerSelected.emit(true);*/
  }

}
