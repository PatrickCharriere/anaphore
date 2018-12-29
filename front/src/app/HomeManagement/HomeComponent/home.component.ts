import { Component } from '@angular/core';
import { WebsocketService } from '../../SharedKernel/WebsocketManagement/websocket.service';
import { User } from '../../SharedKernel/User'
import { UserService } from 'src/app/SharedKernel/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [WebsocketService, UserService]
})
export class HomeComponent {
  
  applicationState = "entry";
  waitingUserList: User[] = [];
  constructor(){ }

  ngOnInit() {}

  goToWaitingRoom() {

    this.applicationState = "waiting";

  }

  goToGame() {

    this.applicationState = "partyInProgress";

  }

  updateState(next: boolean) {

    switch(this.applicationState) {

      case "entry":
        if (next) this.applicationState = "waiting"
        break;
      case "waiting":
        if (next) this.applicationState = "partyInProgress"
        else this.applicationState = "entry"
        break;
      case "partyInProgress":
        if (!next) this.applicationState = "waiting"
        break;

    }

  }

}
