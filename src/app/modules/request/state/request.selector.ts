import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionState } from './request.reducer';

export const selectCollectionRequestState =
  createFeatureSelector<CollectionState>('collectionRequest');

export const selectAllRequests = createSelector(
  selectCollectionRequestState,
  (state) => state.requests
);

export const selectAvailableRequests = createSelector(
  selectCollectionRequestState,
  (state) => state.requests.filter(
    req => req.status === 'approved'
  )
);

export const selectPendingUserRequests = createSelector(
  selectAllRequests,
  (requests) => requests.filter(
    req => req.status === 'pending'
  )
);

export const selectRequestLoading = createSelector(
  selectCollectionRequestState,
  (state) => state.loading
);

export const selectRequestError = createSelector(
  selectCollectionRequestState,
  (state) => state.error
);
