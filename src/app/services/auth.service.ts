import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // <--- Importujemo biblioteku

// Prilagodi ovo onome što tvoj Spring Boot vraća
export interface LoginResponse {
  jwt: string;
}

// Struktura onoga što je zapakovano u Tokenu
export interface JwtPayload {
  sub: string;        // email ili username
  id: number;         // korisni ako backend pakuje ID
  permissions: string[];
  exp: number;        // expiration time (Unix timestamp)
  iat: number;        // issued at
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'token';
  private readonly apiUrl = 'http://localhost:8080/api/auth/login'; // <--- Proveri putanju

  constructor(private http: HttpClient) {}

  // 1. Login metoda koja gadja pravi Backend
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response && response.jwt) {
          this.setToken(response.jwt);
        }
      })
    );
  }

  // 2. Rad sa LocalStorage-om
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // 3. Provera da li je ulogovan (Token postoji i nije istekao)
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.getDecodedToken(token);
    if (!decoded || !decoded.exp) return false;

    const currentTime = Date.now() / 1000; // Pretvaramo ms u sekunde
    return decoded.exp > currentTime;
  }

  // 4. Dekodiranje pomoću biblioteke
  getDecodedToken(token: string = ''): JwtPayload | null {
    const tokenToDecode = token || this.getToken();
    if (!tokenToDecode) return null;

    try {
      return jwtDecode<JwtPayload>(tokenToDecode);
    } catch (error) {
      console.error('Neispravan token', error);
      return null;
    }
  }

  // 5. Provera permisija
  hasPermission(permission: string): boolean {
    const payload = this.getDecodedToken();
    if (!payload || !payload.permissions) return false;

    return payload.permissions.includes(permission);
  }

  // Opciono: Dohvati email trenutnog korisnika
  getCurrentUserEmail(): string | null {
    const payload = this.getDecodedToken();
    return payload ? payload.sub : null;
  }
}
