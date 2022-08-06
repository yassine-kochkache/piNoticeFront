import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ConnectedGuard implements CanActivate {
  constructor(private router:Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkNotConnected();
  }
  checkNotConnected(): boolean {
    if (!localStorage.getItem("token")) {
      return true;
    } else {
      this.router.navigate(["/home"]);
      return false;
    }
  }
}