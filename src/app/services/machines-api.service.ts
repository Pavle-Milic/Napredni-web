import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machine } from '../models/machine.model';
import { MachineError } from '../models/machine-error.model'; // Pretpostavka da imas model

@Injectable({ providedIn: 'root' })
export class MachinesApiService {
  private baseUrl = 'http://localhost:8080/api/machines';

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

  // start(id) ili start(id, scheduledDate)
  startMachine(id: number, scheduledTime?: string): Observable<any> {
    if(scheduledTime) {
       // Ako ima datum, gadjas endpoint za zakazivanje
       return this.http.post(`${this.baseUrl}/schedule`, { machineId: id, operation: 'START', date: scheduledTime });
    }
    return this.http.post(`${this.baseUrl}/start/${id}`, {});
  }

  stopMachine(id: number, scheduledTime?: string): Observable<any> {
    if(scheduledTime) {
       return this.http.post(`${this.baseUrl}/schedule`, { machineId: id, operation: 'STOP', date: scheduledTime });
    }
    return this.http.post(`${this.baseUrl}/stop/${id}`, {});
  }

  restartMachine(id: number, scheduledTime?: string): Observable<any> {
    if(scheduledTime) {
       return this.http.post(`${this.baseUrl}/schedule`, { machineId: id, operation: 'RESTART', date: scheduledTime });
    }
    return this.http.post(`${this.baseUrl}/restart/${id}`, {});
  }

  // Metoda za dovlačenje grešaka
  getErrors(): Observable<MachineError[]> {
      return this.http.get<MachineError[]>(`${this.baseUrl}/errors`);
  }
}
