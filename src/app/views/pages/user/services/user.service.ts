import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _http: HttpClient) {}

  getUser(): Observable<any> {
    return this._http.get<any>(`${environment.api}users/me`).pipe(
      map((res: any) => res?.data || res)
    );
  }
  /*
    ----------------------------
    ===== Api Not Work =========
    ----------------------------
  */ 
  // updateUser(user: any): Observable<any> {
  //   return this._http.put<any>(`${environment.api}/v1/users/1`, user);
  // }
}
