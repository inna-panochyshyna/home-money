import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
  private isAuthentificated = false;

  login() {
    this.isAuthentificated = true;
  }

  logout() {
    this.isAuthentificated = false;
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem("user")) {
      return true;
    } else {
      return this.isAuthentificated;
    }
  }
}
