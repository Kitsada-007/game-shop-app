import { Component } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from "./components/header/header";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  isLoginOrRegisterPage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const currentUrl = event.urlAfterRedirects;
        this.isLoginOrRegisterPage =
          currentUrl.includes('login') || currentUrl.includes('register') || currentUrl.includes('home-admin') || currentUrl.includes('profile-admin') || currentUrl.includes('transaction') || currentUrl.includes('historys') || currentUrl.includes('promo')
  });
}
}
