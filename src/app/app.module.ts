import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Import components
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
// import {ScrollingModule} from '@angular/cdk/scrolling';
// import {DropdownModule} from 'primeng/dropdown';
import { SelectModule } from 'ng-select';
import {CalendarModule} from 'primeng/calendar';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { AuthInterceptor } from './services/auth.interceptor';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import {NgxPaginationModule} from 'ngx-pagination';
import {CheckboxModule} from 'primeng/checkbox';
import { ProfileComponent } from './views/profile/profile.component';
import { UpdatePasswordComponent } from './views/update-password/update-password.component';

@NgModule({
  imports: [
    BrowserModule,
    CheckboxModule,
    ConfirmDialogModule,
    SelectModule,
    ReactiveFormsModule,
    CalendarModule,
    // ScrollingModule,

    // DropdownModule,
    FileUploadModule,
    HttpClientModule,
    InputTextareaModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ToasterModule,
    NgxPaginationModule,

  ],
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ProfileComponent,
    UpdatePasswordComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ToasterService,
  DatePipe,
  ConfirmationService
],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
