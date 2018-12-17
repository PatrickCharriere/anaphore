import { Component } from '@angular/core';
import { WebsocketService } from '../../SharedKernel/WebsocketManagement/websocket.service';
import { User } from '../../SharedKernel/user'

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [WebsocketService]
})
export class HomeComponent {
  communicationSocket;
  applicationState = "entry";
  waitingUserList: User[] = [];
  constructor(private websocket: WebsocketService){ }

  ngOnInit() {

    this.communicationSocket = this.websocket.connect();
    
  }

  goToWaitingRoom() {

    this.applicationState = "waiting";
    
  }

}
