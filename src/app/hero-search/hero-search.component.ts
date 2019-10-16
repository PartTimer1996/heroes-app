import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap,tap
} from 'rxjs/operators';

import { Hero }         from '../hero';
import { HeroService }  from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();
  Loading: boolean = false;

constructor(private heroservice: HeroService) { }

  search(term: string): void{
    this.searchTerms.next(term);
  }

  ngOnInit(): void {

    this.heroes$ = this.searchTerms.pipe(
      tap(() => this.Loading = true),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term:string) => this.heroservice.searchHeroes(term)),
      tap(() => this.Loading = false)
    );

  }

}
