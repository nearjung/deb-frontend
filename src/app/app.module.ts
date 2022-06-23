import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './app-material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './authorization/auth.interceptor';
import { ConfigServerService } from './core/config-server.service';
import { ActionModalComponent } from './pages/control/action-modal/action-modal.component';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
registerLocaleData(localeTh);

@NgModule({
  declarations: [
    AppComponent,
    ActionModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
    ConfigServerService, ,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: "th-TH" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
