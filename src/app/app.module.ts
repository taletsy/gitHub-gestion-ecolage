import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AccueilComponent } from './accueil/accueil.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ReinscriptionComponent } from './reinscription/reinscription.component';
import { FormsModule } from '@angular/forms';
import { FilterStudentsPipe } from './filter-students.pipe';
import { ReglementComponent } from './reglement/reglement.component';
import { PageIntrouvableComponent } from './page-introuvable/page-introuvable.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FilterClassePipe } from './filter-classe.pipe';

const routes = [
  { path: '', component: LoginComponent },
  { path: 'authentification', component: LoginComponent },

  {
    path: 'inscription',
    canActivate: [AuthGuard],
    component: InscriptionComponent,
  },
  {
    path: 'reinscription',
    canActivate: [AuthGuard],
    component: ReinscriptionComponent,
  },

  {
    path: 'reglement',
    canActivate: [AuthGuard],
    component: ReglementComponent,
  },
  { path: 'page-introuvable', component: PageIntrouvableComponent },
  { path: '**', redirectTo: '/page-introuvable' },
];

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    LoginComponent,
    InscriptionComponent,
    ReinscriptionComponent,
    ReglementComponent,
    PageIntrouvableComponent,
    FilterClassePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    FilterStudentsPipe,
  ],
  providers: [AuthService, AuthGuard],

  bootstrap: [AppComponent],
})
export class AppModule {}
