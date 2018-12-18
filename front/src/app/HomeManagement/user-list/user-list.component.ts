import { Component, OnInit, Input } from '@angular/core';
import { UserList } from '../../SharedKernel/user';
import { WebsocketService } from 'src/app/SharedKernel/WebsocketManagement/websocket.service';
import { SocketChannel } from 'src/app/SharedKernel/WebsocketManagement/SocketChannel';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userList: UserList = [];
  private subscriber;

  private communicationSocket;

  constructor(private websocket: WebsocketService) {}

  ngOnInit() {
    
    this.communicationSocket = this.websocket.connect();

    this.communicationSocket.next({
      command: SocketChannel.ListWaitingRoomRequest,
    });

    this.subscriber = this.websocket.waitingRoom().subscribe((data) => {

      this.userList = data;
    
    })

  }

  ngOnDestroy() {

    this.subscriber.unsubscribe();

  }

  sendMessage() {
    /*this.communicationSocket.next({
      command: 'startGame',
    });
    this.playerSelected.emit(true);*/
  }

}
