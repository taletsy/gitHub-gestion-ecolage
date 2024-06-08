import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  template: '<app-login></app-login>',
})
export class AppComponent implements AfterViewInit {
  @ViewChild(LoginComponent, { static: true })
  loginComponent!: LoginComponent;
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    const el = document.getElementById('deco');
    const el1 = document.getElementById('navInscription');

    if (el) {
      el.style.display = 'none';
    }
    if (el1) {
      el1.style.display = 'none';
    }
  }
  constructor(private authService: AuthService, private router: Router) {}

  modeClaire() {
    const myHtml = document.getElementById('myHtml');

    if (myHtml) {
      myHtml.setAttribute('data-bs-theme', 'light');
    }
  }
  modeSombre() {
    const myHtml = document.getElementById('myHtml');

    if (myHtml) {
      myHtml.setAttribute('data-bs-theme', 'dark');
    }
  }
  modeToogle() {
    const myHtml = document.getElementById('myHtml');
    if (myHtml) {
      console.log(myHtml.style.color);
    }
  }

  onSignOut() {
    this.authService.signOut();
    this.router.navigate(['/authentification']);
  }

  clickReinscrire() {
    const el = document.getElementById('navInscription');
    if (el) {
      el.style.display = 'none';
    }
  }
  clickInscrire() {
    const el = document.getElementById('navInscription');
    if (el) {
      el.style.display = 'block';
    }
  }
}
