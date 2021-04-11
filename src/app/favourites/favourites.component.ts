import { Component, OnDestroy, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit, OnDestroy {

favourites: Array<any> = [];

private liveFavourites: any;
  constructor(private musicDataService: MusicDataService) { }

  ngOnInit(): void {
    this.liveFavourites = this.musicDataService.getFavourites().subscribe(data => {this.favourites = data.tracks; console.log(data)}, (err) =>{
      console.log(err);
    });
  }

  removeFromFavourites(id: any) {
    this.liveFavourites = this.musicDataService.removeFromFavourites(id).subscribe(data => this.favourites = data.tracks)
  }

  ngOnDestroy() {
    this.liveFavourites.unsubscribe();
  }
}
