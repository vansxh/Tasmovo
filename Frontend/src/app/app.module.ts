import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';

import {AppComponent} from './app.component';
import {AddComponent} from './pages/add/add.component';
import {ViewComponent} from './pages/view/view.component';
import {RouterModule, Routes} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {InsertTaskComponent} from './pages/insert-task/insert-task.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DatePipe} from '@angular/common';
import {LOCALE_ID} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeAt from '@angular/common/locales/de-AT';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {LandingComponent} from './pages/landing/landing.component';
import {AuthGuard} from './guards/auth.guard';
import {ValidateEqualModule} from 'ng-validate-equal';
import {TimerComponent} from './pages/timer/timer.component';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {OverviewComponent} from './pages/overview/overview.component';
import {InsertGroupComponent} from './pages/insert-group/insert-group.component';
import {InsertCategoryComponent} from './pages/insert-category/insert-category.component';
import {MyCategoriesComponent} from './pages/my-categories/my-categories.component';
import {CategoryComponent} from './pages/category/category.component';
import {SubCategoryComponent} from './pages/sub-category/sub-category.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {LoggedInGuard} from './guards/logged-in.guard';
import {TaskComponent} from './pages/task/task.component';
import {NotDonePipe} from './pipes/not-done.pipe';
import {DonePipe} from './pipes/done.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import { PopupFinishComponent } from './popups/popup-finish/popup-finish.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MAT_MOMENT_DATE_FORMATS} from "@angular/material-moment-adapter";
import { SingleTasksComponent } from './pages/single-tasks/single-tasks.component';
import { AllTasksComponent } from './pages/all-tasks/all-tasks.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CategoryPipe } from './pipes/category.pipe';
import { SubcategoryPipe } from './pipes/subcategory.pipe';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {NgbModalModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from "@angular/material/core";
import { MatTimepickerModule } from 'mat-timepicker';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import {NgxMatTimepickerModule} from "ngx-mat-timepicker";
import { OfCategoryPipe } from './pipes/of-category.pipe';

registerLocaleData(localeAt);

export const routes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'view', component: ViewComponent, canActivate: [AuthGuard]},
  {path: 'add', component: AddComponent, canActivate: [AuthGuard]},
  {path: 'insert-task', component: InsertTaskComponent, canActivate: [AuthGuard]},
  {path: 'insert-task/:TAID', component: InsertTaskComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'home', component: LandingComponent, canActivate: [LoggedInGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard]},
  {path: 'login', component: LoginComponent, canActivate: [LoggedInGuard]},
  {path: 'timer', component: TimerComponent, canActivate: [AuthGuard]},
  {path: 'overview', component: OverviewComponent, canActivate: [AuthGuard]},
  {path: 'insert-group', component: InsertGroupComponent, canActivate: [AuthGuard]},
  {path: 'insert-category', component: InsertCategoryComponent, canActivate: [AuthGuard]},
  {path: 'insert-category/:CAID', component: InsertCategoryComponent, canActivate: [AuthGuard]},
  {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard]},
  {path: 'category', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'category/:CAID', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'my-categories', component: MyCategoriesComponent, canActivate: [AuthGuard]},
  {path: 'all-tasks', component: AllTasksComponent, canActivate: [AuthGuard]},
  {path: 'single-tasks', component: SingleTasksComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'sub-category', component: SubCategoryComponent, canActivate: [AuthGuard]},
  {path: 'sub-category/:CAID', component: SubCategoryComponent, canActivate: [AuthGuard]}
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
    InsertCategoryComponent,
    MyCategoriesComponent,
    CategoryComponent,
    SubCategoryComponent,
    ProfileComponent,
    TaskComponent,
    NotDonePipe,
    DonePipe,
    PopupFinishComponent,
    SingleTasksComponent,
    AllTasksComponent,
    CategoryPipe,
    SubcategoryPipe,
    OfCategoryPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
    BrowserAnimationsModule,
    ValidateEqualModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    CommonModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModalModule,
    MatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    NgbProgressbarModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "de-AT"},
    DatePipe,
    {
      provide: MAT_MOMENT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ],
  bootstrap: [AppComponent],
  exports: [CalendarComponent]
})
export class AppModule {
}
