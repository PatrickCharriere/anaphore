import { Injectable } from '@angular/core';
import { User } from './users';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class UserService {

  private user: BehaviorSubject<User>;

  constructor() {
    this.user = new BehaviorSubject<User>(undefined);
  }

  public set(user: User) {
    this.user.next(user);
  }

  public get(): Observable<User> {
    return this.user.asObservable();
  }

}