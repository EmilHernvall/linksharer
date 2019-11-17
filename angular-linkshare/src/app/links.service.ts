import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Link } from './model';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
    constructor(private httpClient: HttpClient) { }

    public getLinks(): Observable<Link[]> {
        return this.httpClient.get<Link[]>("http://localhost:3000/link");
    }

    public createLink(link: Link): Observable<Link[]> {
        return this.httpClient.post<Link[]>("http://localhost:3000/link", link);
    }
}
