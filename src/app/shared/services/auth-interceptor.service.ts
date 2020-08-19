import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";

export class AuthInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url.indexOf("bank.gov.ua") === -1) {
      const newRequest = request.clone({
        headers: request.headers.append("Auth", "Token"),
      });
      return next.handle(newRequest);
    } else {
      return next.handle(request);
    }
  }
}
