import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../pages/auth/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  get loggedIn(): boolean {
    return this._auth.loggedIn();
  }

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {}
}
