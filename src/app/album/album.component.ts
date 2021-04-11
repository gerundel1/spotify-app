import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit, OnDestroy {

  album: any;
  currentId: any;

  private liveId: any;
  private liveAlbum: any;

  constructor(private matSnackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private musicDataService: MusicDataService) {}

  ngOnInit(): void {
    this.liveId = this.activatedRoute.params.subscribe(params => this.currentId = params.id);
    this.liveAlbum = this.musicDataService.getAlbumById(this.currentId).subscribe(album => this.album = album);
  }

  addToFavourites(trackId: any): void {
    this.musicDataService.addToFavourites(trackId).subscribe((success) =>{
      this.matSnackBar.open("Adding to Favourites...", "Done", { duration: 1500 });
    }, (err) =>{
      this.matSnackBar.open("Unable to add the song to Favourites");
    });
  }

  ngOnDestroy() {
    this.liveId.unsubscribe();
    this.liveAlbum.unsubscribe();
  }
}
