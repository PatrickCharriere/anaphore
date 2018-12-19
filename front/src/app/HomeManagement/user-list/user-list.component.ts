import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserList } from '../../SharedKernel/user';
import { WebsocketService } from 'src/app/SharedKernel/WebsocketManagement/websocket.service';
import { SocketChannel } from 'src/app/SharedKernel/WebsocketManagement/SocketChannel';
import { UserService } from 'src/app/SharedKernel/user.service';
import { User } from 'src/app/SharedKernel/users';
import { Proposal } from 'src/app/SharedKernel/proposal';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  _user: User;
  userList: UserList = [];
  private communicationSocket;
  private waitingRoomSubscription;
  private gameProposalSubscription;
  private gameProposalResponseSubscription;
  @Output() startGame = new EventEmitter<void>();

  constructor(private websocket: WebsocketService,
    private user: UserService) {}

  ngOnInit() {
    
    this.communicationSocket = this.websocket.connect();

    this.user.get().subscribe(user => {
      
      this._user = user

      this.waitingRoomSubscription = this.websocket.waitingRoom().subscribe((userList) => {
        this.userList = userList.filter(user => (user.id != this._user.id));
      })

    })

    this.communicationSocket.next({
      command: SocketChannel.ListWaitingRoomRequest,
    })

    this.subscribeToGameProposals();
    this.subscribeToOpponentResponse();

  }

  subscribeToGameProposals() {

    this.gameProposalSubscription = this.websocket.gameProposal().subscribe((proposal) => {
      
      this.gameProposalSubscription.unsubscribe()
      let accepted: boolean = false;

      accepted = confirm(proposal.proposer.name + ' vous propose de jouer, accepter ?')

      this.communicationSocket.next({
        command: SocketChannel.GameProposalResponse,
        value: {
          proposal: proposal,
          accepted: accepted,
        },
      })

      if (accepted) {

        this.startGame.emit();

      } else {
        
        this.subscribeToGameProposals();

      }

    })

  }

  subscribeToOpponentResponse() {

    this.gameProposalResponseSubscription = this.websocket.opponentResponse().subscribe((response) => {
      
      if (response.accepted) {

        alert(response.proposal.opponent.name + ' a accepté votre demande, la partie commence...');
        this.startGame.emit();

      } else {

        alert(response.proposal.opponent.name + ' n\'a pas accepté votre demande, trouvez vite un nouvel adversaire');

      }

      

    })

  }

  userSelected(user: User) {

    const proposal: Proposal = {
      proposer: this._user,
      opponent: user,
    };

    this.communicationSocket.next({
      command: SocketChannel.ProposeGame,
      value: proposal,
    })

  }

  ngOnDestroy() {

    this.waitingRoomSubscription.unsubscribe()
    this.gameProposalSubscription.unsubscribe()
    this.gameProposalResponseSubscription.unsubscribe()

  }

}
