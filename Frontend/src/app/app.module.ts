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

export const routes: Routes = [
  {path: '', component: ViewComponent, pathMatch: 'full'},
  {path: 'view', component: ViewComponent},
  {path: 'add', component: AddComponent},
  {path: 'insert-task', component: InsertTaskComponent},
  {path: 'insert-task/:TAID', component: InsertTaskComponent},
  {path: 'dashboard', component: DashboardComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    ViewComponent,
    DashboardComponent,
    InsertTaskComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
