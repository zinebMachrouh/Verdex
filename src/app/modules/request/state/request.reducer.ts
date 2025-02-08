import { createReducer, on } from '@ngrx/store';
import { CollectionRequest } from '../models/request.model';
import * as CollectionActions from './request.actions';


export interface CollectionState {
  requests: CollectionRequest[];
  loading: boolean;
  error: any;
  pointsBalance?: number;
}

export const initialState: CollectionState = {
  requests: [],
  loading: false,
  error: null
};

export const collectionReducer = createReducer(
  initialState,

  // Load Requests
  on(CollectionActions.loadRequests, state => ({
    ...state,
    loading: true
  })),
  on(CollectionActions.loadRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests,
    loading: false
  })),
  on(CollectionActions.loadRequestsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Add Request
  on(CollectionActions.addRequest, state => ({
    ...state,
    loading: true
  })),
  on(CollectionActions.addRequestSuccess, (state, { request }) => ({
    ...state,
    requests: [...state.requests, request],
    loading: false
  })),
  on(CollectionActions.addRequestFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Update Request Status
  on(CollectionActions.updateRequestStatus, state => ({
    ...state,
    loading: true
  })),
  on(CollectionActions.updateRequestStatusSuccess, (state, { request }) => ({
    ...state,
    requests: state.requests.map(r =>
      r.id === request.id ? request : r
    ),
    loading: false
  })),
  on(CollectionActions.updateRequestStatusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Delete Request
  on(CollectionActions.deleteRequest, state => ({
    ...state,
    loading: true
  })),
  on(CollectionActions.deleteRequestSuccess, (state, { requestId }) => ({
    ...state,
    requests: state.requests.filter(r => r.id !== requestId),
    loading: false
  })),
  on(CollectionActions.deleteRequestFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Points Conversion
  on(CollectionActions.convertPoints, state => ({
    ...state,
    loading: true
  })),
  on(CollectionActions.convertPointsSuccess, (state, { userId, voucherValue }) => ({
    ...state,
    loading: false
  })),
  on(CollectionActions.convertPointsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
