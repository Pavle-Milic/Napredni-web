import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from "jwt-decode"; // Ako koristis biblioteku za dekodiranje

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login'; // Proveri putanju

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        // PAZNJA: Ovde je kljucno mesto!
        // Ako backend vraca: {"jwt": "token..."}, onda koristimo response.jwt
        // Ako backend vraca samo string, onda koristimo response.

        const token = response.jwt || response.token || response;

        if (token) {
          localStorage.setItem('jwt', token); // Cuvamo u LocalStorage
          console.log("Token sacuvan:", token); // <--- OVO CE TI RECI DA LI RADI
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
  clearToken(): void {
    localStorage.removeItem('jwt'); // Briše token iz memorije pretraživača
    console.log("Korisnik odjavljen, token obrisan.");
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Dodaj metodu za permisije ako fali
  hasPermission(permission: string): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);

      // Backend salje permissions kao niz objekata: [{authority: "read_user"}, ...]
      // Mi moramo to pretvoriti u niz stringova: ["read_user", ...]

      let userPermissions: string[] = [];

      if (decoded.permissions) {
        // Mapiramo niz objekata u niz stringova
        userPermissions = decoded.permissions.map((p: any) => p.authority || p);
      }

      // Sada proveravamo da li niz sadrzi trazenu dozvolu
      return userPermissions.includes(permission);

    } catch (error) {
      console.error('Greška pri čitanju permisija:', error);
      return false;
    }
  }
}
