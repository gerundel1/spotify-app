import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-artist-discography',
  templateUrl: './artist-discography.component.html',
  styleUrls: ['./artist-discography.component.css']
})
export class ArtistDiscographyComponent implements OnInit, OnDestroy{

  albums: any;
  artist: any;
  currentId: any;
  
  private liveId : any;
  private liveArtist: any;
  private liveAlbums: any;

  constructor(private activatedRoute: ActivatedRoute, private musicDataService: MusicDataService) {
  }

  ngOnInit(): void {
    this.liveId = this.activatedRoute.params.subscribe(params => this.currentId = params.id);
    this.liveArtist = this.musicDataService.getArtistById(this.currentId).subscribe(results => this.artist = results);
    this.liveAlbums = this.musicDataService.getAlbumsByArtistId(this.currentId).subscribe(data => {
      let uniqueSet = new Set();
      let uniqueList: any[] = [];
      data.items.forEach((item: { name: string; }) => uniqueSet.add(item.name));
      this.albums = data.items.filter((item: any) => {
        if (uniqueSet.has(item.name)) {
          uniqueList.push(item);
          uniqueSet.delete(item.name);
        }
      });
      this.albums = uniqueList;
    });
  }

  ngOnDestroy() {
    this.liveAlbums.unsubscribe();
    this.liveArtist.unsubscribe();
    this.liveId.unsubscribe();
  }

}
