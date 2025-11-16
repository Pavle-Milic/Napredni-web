import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MockDataService } from '../services/mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(
    private mockService: MockDataService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'];

    const loggedUser = this.mockService.getLoggedUser();


    if (!loggedUser) {
      alert("Morate prvo da se ulogujete.");
      this.router.navigate(['/login']);
      return false;
    }

    // ako nema potrebnu permisiju
    if (!loggedUser.permissions?.includes(requiredPermission)) {
      alert("Nemate dozvolu za pristup ovoj stranici.");
      return false;

    }

    return true;
  }
}
