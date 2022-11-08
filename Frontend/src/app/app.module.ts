import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { AddComponent } from './pages/add/add.component';
import { ViewComponent } from './pages/view/view.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InsertTaskComponent } from './pages/insert-task/insert-task.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeAt from '@angular/common/locales/de-AT';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthGuard } from './guards/auth.guard';
import { ValidateEqualModule } from  'ng-validate-equal';
import { TimerComponent } from './pages/timer/timer.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { InsertGroupComponent } from './pages/insert-group/insert-group.component';
import { InsertCategoryComponent } from './pages/insert-category/insert-category.component';
registerLocaleData(localeAt);

export const routes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'view', component: ViewComponent, canActivate: [AuthGuard]},
  {path: 'add', component: AddComponent, canActivate: [AuthGuard]},
  {path: 'insert-task', component: InsertTaskComponent, canActivate: [AuthGuard]},
  {path: 'insert-task/:TAID', component: InsertTaskComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'home', component: LandingComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'timer', component: TimerComponent, canActivate: [AuthGuard]},
  {path: 'overview', component: OverviewComponent, canActivate: [AuthGuard]},
  {path: 'insert-group', component: InsertGroupComponent, canActivate: [AuthGuard]},
  {path: 'insert-category', component: InsertCategoryComponent, canActivate: [AuthGuard]},
  {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard]}

];

@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    ViewComponent,
    DashboardComponent,
    InsertTaskComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    TimerComponent,
    CalendarComponent,
    OverviewComponent,
    InsertGroupComponent,
    InsertCategoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
    BrowserAnimationsModule,
    ValidateEqualModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "de-AT"},
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
