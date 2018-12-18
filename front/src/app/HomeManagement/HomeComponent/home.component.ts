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
  
  applicationState = "entry";
  waitingUserList: User[] = [];
  constructor(){ }

  ngOnInit() {}

  goToWaitingRoom() {

    this.applicationState = "waiting";
    
  }

}
