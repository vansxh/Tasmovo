import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule, PathLocationStrategy} from '@angular/common';

import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
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
import { FlatpickrModule } from 'angularx-flatpickr';
import {CalendarDateFormatter, CalendarModule, DateAdapter} from 'angular-calendar';
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
import { CalendarDetailComponent } from './pages/calendar-detail/calendar-detail.component';
import { SwiperModule } from 'swiper/angular';
import { PopupAddComponent } from './popups/popup-add/popup-add.component';
import {CalendarNativeDateFormatter, DateFormatterParams} from 'angular-calendar';
import { MyDayComponent } from './pages/my-day/my-day.component';
import { PopupReminderComponent } from './popups/popup-reminder/popup-reminder.component';
import { PopupMydayComponent } from './popups/popup-myday/popup-myday.component';
import { CountdownModule } from 'ngx-countdown';
import { SpinnerComponent } from './spinner/spinner.component';
import {LoadingInterceptor} from "./loading.interceptor";
import { BackButtonDirective } from './back-button.directive';
import {MatSelectModule} from '@angular/material/select';
import {NGX_MAT_SELECT_CONFIGS, NgxMatSelectConfigs, NgxMatSelectModule} from "ngx-mat-select";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { HammerModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatSliderModule} from '@angular/material/slider';
import { ConfirmationDialogComponent } from './popups/confirmation-dialog/confirmation-dialog.component';
import { LocationStrategy } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

class CustomDateFormatter extends CalendarNativeDateFormatter {

  public override monthViewColumnHeader({date, locale}: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {weekday: 'short'}).format(date);
  }

}

export const ngxMatSelectConfigs: NgxMatSelectConfigs = {
  maxWidthForMobileView: 768,
  inFirstLoadCallSearcher: true,
  inFirstLoadSearcherValue: '',
  emptyLabel: 'Keine Auswahlmöglichkeiten gefunden',
  noMoreResultLabel: '',
  useInfiniteScroll: false,
  searchBoxPlaceholder: 'Suchen...',
  maximumResultForShow: 30,
  useMobileView: true,
  mobileViewType: 'FullScreen',
}

registerLocaleData(localeAt);

export const routes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full', canActivate: [LoggedInGuard]},
  {path: 'insert-task', component: InsertTaskComponent, canActivate: [AuthGuard]},
  {path: 'insert-task/:TAID', component: InsertTaskComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'home', component: LandingComponent, canActivate: [LoggedInGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard]},
  {path: 'login', component: LoginComponent, canActivate: [LoggedInGuard]},
  {path: 'timer', component: TimerComponent, canActivate: [AuthGuard]},
  {path: 'overview', component: OverviewComponent, canActivate: [AuthGuard]},
  {path: 'insert-category', component: InsertCategoryComponent, canActivate: [AuthGuard]},
  {path: 'insert-category/:CAID', component: InsertCategoryComponent, canActivate: [AuthGuard]},
  {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard]},
  {path: 'category/:CAID', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'my-categories', component: MyCategoriesComponent, canActivate: [AuthGuard]},
  {path: 'all-tasks', component: AllTasksComponent, canActivate: [AuthGuard]},
  {path: 'single-tasks', component: SingleTasksComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'sub-category/:CAID', component: SubCategoryComponent, canActivate: [AuthGuard]},
  {path: 'calendar-detail', component: CalendarDetailComponent, canActivate: [AuthGuard]},
  {path: 'calendar-detail/:date', component: CalendarDetailComponent, canActivate: [AuthGuard]},
  {path: 'my-day', component: MyDayComponent, canActivate: [AuthGuard]},
  {path: 'task/:TAID', component: TaskComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    InsertTaskComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    TimerComponent,
    CalendarComponent,
    OverviewComponent,
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
    OfCategoryPipe,
    CalendarDetailComponent,
    PopupAddComponent,
    MyDayComponent,
    PopupReminderComponent,
    PopupMydayComponent,
    SpinnerComponent,
    BackButtonDirective,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes/*, {onSameUrlNavigation: 'reload'}*/),
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
    NgbProgressbarModule,
    SwiperModule,
    CountdownModule,
    MatSelectModule,
    NgxMatSelectModule,
    MatAutocompleteModule,
    HammerModule,
    FontAwesomeModule,
    MatSliderModule,
    MatFormFieldModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "de-AT"},
    {provide: NGX_MAT_SELECT_CONFIGS, useValue: ngxMatSelectConfigs},
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
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    {provide: CalendarDateFormatter, useClass: CustomDateFormatter},
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    },
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [AppComponent],
  exports: [CalendarComponent]
})
export class AppModule {
}
