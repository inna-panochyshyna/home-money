import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { AppRoutingModule } from "./app-routing.module";
import { UsersService } from "./shared/services/users.service";
import { AuthService } from "./shared/services/auth.service";
import { AuthGuard } from "./shared/services/auth-guard.service";
import { NotFoundComponent } from "./shared/components/not-found/not-found.component";
import { AuthInterceptorService } from "./shared/services/auth-interceptor.service";

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [BrowserModule, HttpClientModule, AuthModule, AppRoutingModule],
  providers: [
    UsersService,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
