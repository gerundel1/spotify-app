import { Component, OnDestroy, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';


@Component({
  selector: 'app-new-releases',
  templateUrl: './new-releases.component.html',
  styleUrls: ['./new-releases.component.css']
})

export class NewReleasesComponent implements OnInit, OnDestroy {

  releases: any;

  private liveReleases: any;

  constructor(private musicDataService: MusicDataService) { }

  ngOnInit(): void {
    this.liveReleases = this.musicDataService.getNewReleases().subscribe(data => this.releases = data.albums.items);
  }
  ngOnDestroy() {
    this.liveReleases.unsubscribe();
  }
}
