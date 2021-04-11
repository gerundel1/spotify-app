import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnDestroy {

  results: any;
  searchQuery: any;

  private queryLive: any;
  private liveArtists: any;
  constructor(private activatedRoute: ActivatedRoute, private musicDataService: MusicDataService) { }

  ngOnInit(): void {
    this.queryLive = this.activatedRoute.queryParams.subscribe(query => this.searchQuery = query.q);
    this.liveArtists = this.musicDataService.searchArtists(this.searchQuery).subscribe(data =>{
      this.results = data.artists.items.filter((item: { images: string | any[]; }) => item.images.length > 0);
    });
  }

  ngOnDestroy() {
    this.liveArtists.unsubscribe();
    this.queryLive.unsubscribe();
  }

}
