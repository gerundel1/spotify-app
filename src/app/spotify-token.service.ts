import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyTokenService implements OnDestroy {

  private clientID = "99e68280365c4c2ba217f1ce1b748bbd";
  private clientSecret = "29feda684e4b4449b6e1ef2eb0a3f486";

  private accessToken: string;
  private accessTokenExpires: Date;
  private tokenSub: any;

  constructor(private http: HttpClient) { 
    this.accessToken = "";
    this.accessTokenExpires = new Date;
  }

  private getAccessToken(): Observable<any> {

    return new Observable(o => {
      let auth = btoa(`${this.clientID}:${this.clientSecret}`);
      const authBody = new HttpParams().set('grant_type', 'client_credentials');

      this.tokenSub = this.http.post<any>("https://accounts.spotify.com/api/token", authBody.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${auth}` } }).subscribe(token => {
        this.accessToken = token.access_token;
        this.accessTokenExpires = new Date();
        this.accessTokenExpires.setSeconds(this.accessTokenExpires.getSeconds() + token.expires_in);
        o.next(this.accessToken)
      });
    });
  }

  getBearerToken(): Observable<any> {

    if (!this.accessToken) { 
      // no access token, so get a fresh one
      return this.getAccessToken();
    } else { 
      if (new Date() < this.accessTokenExpires) { 
        // access token exists and is valid, so return it
        return new Observable(o => o.next(this.accessToken));
      } else { 
        // access token exists, but is no longer valid, so get a fresh one
        return this.getAccessToken(); 
      }
    }
  }

  ngOnDestroy():void{
    this.tokenSub?.unsubscribe();
  }
}