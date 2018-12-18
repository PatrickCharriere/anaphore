import { Component, OnInit, Input } from '@angular/core';
import { UserList } from '../../SharedKernel/user';
import { WebsocketService } from 'src/app/SharedKernel/WebsocketManagement/websocket.service';
import { SocketChannel } from 'src/app/SharedKernel/WebsocketManagement/SocketChannel';
import { UserService } from 'src/app/SharedKernel/user.service';
import { User } from 'src/app/SharedKernel/users';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  _user: User;
  userList: UserList = [];
  private subscriber;

  private communicationSocket;

  constructor(private websocket: WebsocketService,
    private user: UserService) {}

  ngOnInit() {
    
    this.communicationSocket = this.websocket.connect();

    this.user.get().subscribe(user => {
      
      this._user = user;

      this.subscriber = this.websocket.waitingRoom().subscribe((userList) => {
        this.userList = userList.filter(user => (user.id != this._user.id));
      })

    });

    this.communicationSocket.next({
      command: SocketChannel.ListWaitingRoomRequest,
    });

    

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
