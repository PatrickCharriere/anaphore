import { Component } from '@angular/core';
import { User } from '../../SharedKernel/User';
import { UserService } from '../../SharedKernel/user.service';

@Component({
  selector: 'user-details',
  templateUrl: './user.details.component.html',
  styleUrls: ['./user.details.component.scss'],
})
export class UserDetailsComponent {

    private _user: User

    constructor(private userService: UserService) {}

    ngOnInit() {

      this.userService.get().subscribe(user => {
      
        this._user = user

      })

    }

    public get user(): User {

      return this._user
      
    }

}
