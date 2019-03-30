import { Component } from '@angular/core';
import { WebsocketService } from '../../SharedKernel/WebsocketManagement/websocket.service';
import { User } from '../../SharedKernel/User'
import { UserService } from 'src/app/SharedKernel/user.service';
import { PieceSet } from 'src/app/SharedKernel/Piece';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [WebsocketService, UserService]
})
export class HomeComponent {
  
  private applicationState = "entry";
  private waitingUserList: User[] = [];
  public pieces: PieceSet = [];
  private subscriber;

  constructor(private websocket: WebsocketService){ }

  ngOnInit() {}

  goToWaitingRoom() {

    this.applicationState = "waiting";

  }

  goToGame() {

    this.subscriber = this.websocket.easelUpdate().subscribe((easel) => {
     
      this.subscriber.unsubscribe()
    
      this.pieces = easel["_pieces"]
    
    })

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

  ngOnDestroy() {

    if (this.subscriber) this.subscriber.unsubscribe()

  }

}
