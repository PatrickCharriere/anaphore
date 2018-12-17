import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../SharedKernel/user'

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

  @Input('communicationSocket') communicationSocket;

  constructor() {}

  ngOnInit() {
    this.communicationSocket.next({
      command: 'listWaitingRoom',
    });
  }

  sendMessage() {
    /*this.communicationSocket.next({
      command: 'startGame',
    });
    this.playerSelected.emit(true);*/
  }

}
