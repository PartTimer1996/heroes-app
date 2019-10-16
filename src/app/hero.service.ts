import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private loading:boolean = false;
  private heroesUrl = 'api/heroes';  // URL to web api

  constructor( private http: HttpClient,
    private messageService: MessageService) { }

/** GET heroes from the server */
getHeroes (): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
  .pipe(
    tap(_ => this.log("fetched heroes")),
    catchError(this.handleError<Hero[]>('getHeroes', []))
    );
}

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero: id = ${id}`)),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
private log(message: string) {
  this.messageService.add(`HeroService: ${message}`);
}

private handleError<T> (operation = 'operation', result?:T){
  return (error: any): Observable<T> => {
    console.error(error);
  this.log(`${operation} failed: ${error.message}`);

  return of(result as T);
}
}

updateHero(hero: Hero): Observable<any> {
  return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
    tap(_ => this.log(`updated hero id=${hero.id}`)),
    catchError(this.handleError<any>('updateHero'))
  );
}

addHero(hero: Hero): Observable<Hero>{
  return this.http.post(this.heroesUrl, hero, this.httpOptions).pipe(
    tap((newHero: Hero)=> this.log(`New hero added: ${hero.name}`)),
    catchError(this.handleError<Hero>('addHero'))
  );
}

removeHero(hero: Hero | Hero): Observable<Hero>{
  const id = typeof hero === 'number' ? hero: hero.id;
  const url = `${this.heroesUrl}/${id}` ;

  return this.http.delete<Hero>(url, this.httpOptions).pipe(
    tap (_ => this.log(`deleted hero id: ${id}`)),
    catchError(this.handleError<Hero>('deleteHero'))
  );
}

searchHeroes(term: string): Observable<Hero[]> {

  if (!term.trim()){

    return of([]);
  }
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
    tap(_ => this.log(`found heroes matching ${term}`)),
    catchError(this.handleError<Hero[]>('SearchHeroes', []))
  )
}

}

