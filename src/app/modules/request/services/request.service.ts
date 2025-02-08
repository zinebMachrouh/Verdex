import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {IndxeddbService} from "../../../core/services/indxeddb.service";
import {CollectionRequest} from "../models/request.model";
import {v4 as uuidv4} from "uuid";

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private indexedDbService: IndxeddbService) {}

  getRequests(): Observable<CollectionRequest[]> {
    return from(this.indexedDbService.getAll('requests'));
  }

  addRequest(request: CollectionRequest): Observable<CollectionRequest> {
    return from(this.createRequest(request));
  }

  private async createRequest(request: CollectionRequest): Promise<CollectionRequest> {
    const completeRequest = {
      ...request,
      id: uuidv4(),
      status: 'en attente',
      points: this.calculatePoints(request),
      created_at: new Date().toISOString()
    };

    await this.indexedDbService.add('requests', completeRequest);
    return completeRequest;
  }

  updateRequestStatus(requestId: string, status: string): Observable<CollectionRequest> {
    return from(this.updateStatus(requestId, status));
  }

  private async updateStatus(requestId: string, status: string): Promise<CollectionRequest> {
    const request = await this.indexedDbService.get('requests', requestId);

    if (!request) {
      throw new Error('Request not found');
    }

    const updatedRequest = { ...request, status };
    await this.indexedDbService.put('requests', updatedRequest);
    return updatedRequest;
  }

  deleteRequest(requestId: string): Observable<void> {
    return from(this.indexedDbService.delete('requests', requestId));
  }

  convertPoints(userId: string, points: number): Observable<number> {
    return from(this.processPointsConversion(userId, points));
  }

  private async processPointsConversion(userId: string, points: number): Promise<number> {
    const pointsValues = {
      100: 50,
      200: 120,
      500: 350
    };

    // @ts-ignore
    return pointsValues[points] || 0;
  }

  private calculatePoints(request: CollectionRequest): number {
    const pointRates = {
      'plastique': 2,
      'verre': 1,
      'papier': 1,
      'métal': 5
    };

    return request.types.reduce((total, type) => {
      // @ts-ignore
      const rate = pointRates[type] || 0;
      return total + (rate * request.weight);
    }, 0);
  }
}
