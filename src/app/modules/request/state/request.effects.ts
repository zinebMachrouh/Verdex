import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CollectionActions from './request.actions';
import { RequestService } from '../services/request.service';

@Injectable()
export class CollectionEffects {
  loadRequests$ = createEffect(() => this.actions$.pipe(
    ofType(CollectionActions.loadRequests),
    mergeMap(() =>
      this.collectionService.getRequests().pipe(
        map(requests => CollectionActions.loadRequestsSuccess({ requests })),
        catchError(error => of(CollectionActions.loadRequestsFailure({ error })))
      )
    )
  ));

  addRequest$ = createEffect(() => this.actions$.pipe(
    ofType(CollectionActions.addRequest),
    mergeMap(action =>
      this.collectionService.addRequest(action.request).pipe(
        map(request => CollectionActions.addRequestSuccess({ request })),
        catchError(error => of(CollectionActions.addRequestFailure({ error })))
      )
    )
  ));

  updateRequestStatus$ = createEffect(() => this.actions$.pipe(
    ofType(CollectionActions.updateRequestStatus),
    mergeMap(action =>
      this.collectionService.updateRequestStatus(action.requestId, action.status).pipe(
        map(request => CollectionActions.updateRequestStatusSuccess({ request })),
        catchError(error => of(CollectionActions.updateRequestStatusFailure({ error })))
      )
    )
  ));

  deleteRequest$ = createEffect(() => this.actions$.pipe(
    ofType(CollectionActions.deleteRequest),
    mergeMap(action =>
      this.collectionService.deleteRequest(action.requestId).pipe(
        map(() => CollectionActions.deleteRequestSuccess({ requestId: action.requestId })),
        catchError(error => of(CollectionActions.deleteRequestFailure({ error })))
      )
    )
  ));

  convertPoints$ = createEffect(() => this.actions$.pipe(
    ofType(CollectionActions.convertPoints),
    mergeMap(action =>
      this.collectionService.convertPoints(action.userId, action.points).pipe(
        map(voucherValue => CollectionActions.convertPointsSuccess({
          userId: action.userId,
          voucherValue
        })),
        catchError(error => of(CollectionActions.convertPointsFailure({ error })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private collectionService: RequestService
  ) {}
}
