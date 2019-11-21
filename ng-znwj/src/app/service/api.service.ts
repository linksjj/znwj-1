import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BASE_URL} from '../../environments/environment';
import {Silk} from '../model/silk';

export const BASE_API_URL = `${BASE_URL}/api`;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {
  }

  listSilks(): Observable<Silk[]> {
    return this.http.get<Silk[]>(`${BASE_API_URL}/silks`);
    // return range(0, 10).pipe(
    //   switchMap(() => this.randomSilk()),
    //   toArray(),
    // );
  }

  // private randomSilk(): Observable<Silk> {
  //   const silk = new Silk();
  //   const r = Math.random();
  //   silk.id = '' + r;
  //   silk.galleryItems = [];
  //   silk.galleryItems.push(new ImageItem({src: 'assets/test/1.jpg', thumb: 'assets/test/1.jpg'}));
  //   silk.galleryItems.push(new ImageItem({src: 'assets/test/2.jpg', thumb: 'assets/test/2.jpg'}));
  //   silk.galleryItems.push(new ImageItem({src: 'assets/test/3.jpg', thumb: 'assets/test/3.jpg'}));
  //   return of(silk);
  // }
}
