import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import jwtDecode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const loggedIn = this.getLoggedIn();
    if (!loggedIn) {
      localStorage.removeItem("token");
      this.router.navigate(["/login"]);
    }
    return loggedIn;
  }
  getLoggedIn(){
    const token = JSON.parse(localStorage.getItem("token"));
    if (token !== null && token !== undefined) {
      return this.checkTokenIsNotExpired(token);
    } else {
      return false;
    }
  }
  checkTokenIsNotExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    const currentDate = new Date();
    return decoded.exp >= Math.floor(currentDate.getTime() / 1000);
  }
}
