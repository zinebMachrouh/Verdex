import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { IndxeddbService } from '../../../core/services/indxeddb.service';
import { CollectionRequest } from '../models/request.model';
import { v4 as uuidv4 } from 'uuid';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  userId : string;
  constructor(private indexedDbService: IndxeddbService) {
    this.userId = JSON.parse(<string>sessionStorage.getItem('currentUser')).id;
  }

  getRequests(): Observable<CollectionRequest[]> {
    return from(this.indexedDbService.getAll('requests')).pipe(
      catchError(err => {
        console.error('Error fetching requests:', err);
        return throwError(() => new Error('Failed to fetch requests.'));
      })
    );
  }

  addRequest(request: CollectionRequest): Observable<CollectionRequest> {
    return from(this.createRequest(request)).pipe(
      catchError(err => {
        console.error('Error adding request:', err);
        return throwError(() => new Error('Failed to add request.'));
      })
    );
  }

  private async createRequest(request: CollectionRequest): Promise<CollectionRequest> {
    const completeRequest: CollectionRequest = {
      ...request,
      id: uuidv4(),
      status: 'pending',
      userId: this.userId,
      collectorId : '',
      // @ts-ignore
      points: this.calculatePoints(request)
    };


    await this.indexedDbService.add('requests', completeRequest);
    return completeRequest;
  }

  private update(request: CollectionRequest): Promise<CollectionRequest> {
    return this.indexedDbService.put('requests', request);
  }

  updateRequest(request: CollectionRequest): Observable<CollectionRequest> {
    return from(this.update(request)).pipe(
      catchError(err => {
        console.error('Error updating request:', err);
        return throwError(() => new Error('Failed to update request.'));
      })
    );
  }

  updateRequestStatus(requestId: string, status: string): Observable<CollectionRequest> {
    return from(this.updateStatus(requestId, status)).pipe(
      catchError(err => {
        console.error('Error updating request status:', err);
        return throwError(() => new Error('Failed to update request status.'));
      })
    );
  }

  async updateStatus(requestId: string, status: string): Promise<CollectionRequest> {
    const request = await this.indexedDbService.get('requests', requestId);

    if (!request) {
      throw new Error('Request not found');
    }

    const updatedRequest = { ...request, status };
    await this.indexedDbService.put('requests', updatedRequest);
    return updatedRequest;
  }

  deleteRequest(requestId: string): Observable<void> {
    return from(this.indexedDbService.delete('requests', requestId)).pipe(
      catchError(err => {
        console.error('Error deleting request:', err);
        return throwError(() => new Error('Failed to delete request.'));
      })
    );
  }

  convertPoints(userId: string, points: number): Observable<number> {
    return from(this.processPointsConversion(userId, points)).pipe(
      map(value => value || 0),
      catchError(err => {
        console.error('Error converting points:', err);
        return of(0);
      })
    );
  }

  private async processPointsConversion(userId: string, points: number): Promise<number> {
    const pointsValues = {
      100: 50,
      200: 120,
      500: 350
    };
    //@ts-ignore
    return pointsValues[points] || 0;
  }

  private calculatePoints(request: CollectionRequest): number {
    const pointRates = {
      plastic: 2,
      glass: 1,
      paper: 1,
      metal: 5
    };

    return request.types.reduce((total, type) => {
      //@ts-ignore
      const rate = pointRates[type] || 0;
      return total + rate * (request.weight || 0);
    }, 0);
  }

  storeImage(file: File): Promise<string> {
    return this.indexedDbService.storeImage(file);
  }

  getImage(key: any): Promise<string | null> {
    return this.indexedDbService.getImageBlob('requests', key);
  }
}
