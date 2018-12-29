import { Injectable } from '@angular/core';
import { User } from './User';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebsocketService } from './WebsocketManagement/websocket.service';


@Injectable()
export class UserService {

  private _user: BehaviorSubject<User>;
  private _userChangesSubscription;

  constructor(private websocket: WebsocketService) {

    this._user = new BehaviorSubject<User>(undefined)

    this.subscribeToChanges()

  }

  public set(user: User) {

    this._user.next(user)

  }

  public get(): Observable<User> {

    return this._user.asObservable()

  }

  private subscribeToChanges() {

    this._userChangesSubscription = this.websocket.playerStatus().subscribe((player) => {
      
      this._user.next(player)
      
    })

  }

  private ngOnDestroy() {

      this._userChangesSubscription.unsubscribe()

  }

}