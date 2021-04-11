import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';
import { environment } from './../environments/environment';

import { mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MusicDataService {

  constructor(private spotifyToken: SpotifyTokenService, private http: HttpClient, private auth: AuthService) { }  

  getNewReleases(): Observable<SpotifyApi.ListOfNewReleasesResponse> {
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
        return this.http.get<any>("https://api.spotify.com/v1/browse/new-releases", { headers: { "Authorization": `Bearer ${token}` } });
      }));
  }

  getArtistById (id: any): Observable<SpotifyApi.SingleArtistResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/artists/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
    }));
  }

  getAlbumsByArtistId (id: any): Observable<SpotifyApi.ArtistsAlbumsResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/artists/${id}/albums/?include_groups=album,single&limit=50`, { headers: { "Authorization": `Bearer ${token}` } });
    }));
  }

  getAlbumById (id: any): Observable<SpotifyApi.SingleAlbumResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/albums/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
    }));
  }

  searchArtists (searchString: any): Observable<SpotifyApi.ArtistSearchResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/search/?q=${searchString}&type=artist&limit=50`, { headers: { "Authorization": `Bearer ${token}` } });
    }));
  }

  getFavourites(): Observable<any> {
    return this.http.get<any>(`${environment.userAPIBase}/favourites/`).pipe(mergeMap(favouritesArray => {
      if (favouritesArray.message.length > 0) {
        return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
          return this.http.get<any>(`https://api.spotify.com/v1/tracks/?ids=${favouritesArray.message.join()}`, { headers: { "Authorization": `Bearer ${token}` } });
        }));
      }
      else {
        return new Observable(o=>o.next({tracks: []}));
      }
    }));
  }

  addToFavourites(id: any): Observable<[String]> {
    return this.http.put<any>(`${environment.userAPIBase}/favourites/${id}`, {"user": this.auth.getToken()});
  }
  
  removeFromFavourites(id: any): Observable<any> {
    return this.http.delete<any>(`${environment.userAPIBase}/favourites/${id}`).pipe(mergeMap(favouritesArray => {
      if (favouritesArray.message.length > 0) {
        return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
          return this.http.get<any>(`https://api.spotify.com/v1/tracks/?ids=${favouritesArray.message.join()}`, { headers: { "Authorization": `Bearer ${token}` } });
        }));
      }
      else {
        return new Observable(o=>o.next({tracks: []}));
      }
    }));
  }
}