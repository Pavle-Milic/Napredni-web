import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machine } from '../models/machine.model';
import { MachineError } from '../models/machine-error.model'; // Pretpostavka da imas model

@Injectable({ providedIn: 'root' })
export class MachinesApiService {
  private baseUrl = 'http://localhost:8080/api/machines';
  private errorsUrl = 'http://localhost:8080/api/errors';

  constructor(private http: HttpClient) {}

  search(filters: { name?: string; status?: string; startDate?: string; endDate?: string; }): Observable<Machine[]> {
    let params = new HttpParams();
    if (filters.name) params = params.set('name', filters.name);
    // U backendu status očekuješ verovatno kao ENUM (STOPPED, RUNNING), pazi na velika slova
    if (filters.status) params = params.set('status', filters.status);
    if (filters.startDate) params = params.set('dateFrom', filters.startDate); // Proveri imena parametara na backendu!
    if (filters.endDate) params = params.set('dateTo', filters.endDate);

    return this.http.get<Machine[]>(`${this.baseUrl}/search`, { params });
  }

  create(name: string): Observable<Machine> {
    // Backend verovatno ocekuje objekat, npr. CreateMachineDto
    return this.http.post<Machine>(`${this.baseUrl}/create`, { name });
  }

  destroy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // --- NOVE METODE ZA AKCIJE ---

  startMachine(id: number, scheduledTime?: string): Observable<any> {
    if(scheduledTime) {
      // BITNO: Backend ocekuje 'scheduledTime', ne 'date'!
      return this.http.post(`${this.baseUrl}/schedule`, {
        machineId: id,
        operation: 'START',
        scheduledTime: scheduledTime
      });
    }
    return this.http.post(`${this.baseUrl}/start/${id}`, {});
  }

  stopMachine(id: number, scheduledTime?: string): Observable<any> {
    if(scheduledTime) {
      return this.http.post(`${this.baseUrl}/schedule`, {
        machineId: id,
        operation: 'STOP',
        scheduledTime: scheduledTime
      });
    }
    return this.http.post(`${this.baseUrl}/stop/${id}`, {});
  }

  restartMachine(id: number, scheduledTime?: string): Observable<any> {
    if(scheduledTime) {
      return this.http.post(`${this.baseUrl}/schedule`, {
        machineId: id,
        operation: 'RESTART',
        scheduledTime: scheduledTime
      });
    }
    return this.http.post(`${this.baseUrl}/restart/${id}`, {});
  }

  // --- POPRAVLJENA METODA ZA GRESKE ---
  getErrors(): Observable<MachineError[]> {
    // Gadja http://localhost:8080/api/errors
    return this.http.get<MachineError[]>(this.errorsUrl);
  }
}
