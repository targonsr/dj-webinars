import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleDTO } from './vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleHTTPService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllVehicles(): Observable<VehicleDTO[]> {
    return this.http.get<VehicleDTO[]>(`${this.baseUrl}/vehicles`);
  }
}
