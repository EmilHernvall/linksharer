import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { LinksService } from './links.service';

import { Link } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    links$: Observable<Link[]>;

    link: Link = {
        user: "",
        href: "",
        title: "",
    };

    constructor(private linksService: LinksService) {}

    ngOnInit() {
        this.links$ = this.linksService.getLinks();
    }

    onSubmit() {
        this.links$ = this.linksService.createLink(this.link);
        this.link = {
            user: "",
            href: "",
            title: "",
        };
    }
}
