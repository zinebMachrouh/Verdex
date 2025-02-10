import { createAction, props } from '@ngrx/store';
import {CollectionRequest} from "../models/request.model";

// Load requests
export const loadRequests = createAction('[Collection] Load Requests');
export const loadRequestsSuccess = createAction('[Collection] Load Requests Success', props<{ requests: CollectionRequest[] }>());
export const loadRequestsFailure = createAction('[Collection] Load Requests Failure', props<{ error: any }>());

// Add new request
export const addRequest = createAction('[Collection] Add Request', props<{ request: CollectionRequest }>());
export const addRequestSuccess = createAction('[Collection] Add Request Success', props<{ request: CollectionRequest }>());
export const addRequestFailure = createAction('[Collection] Add Request Failure', props<{ error: any }>());

// Update request status
export const updateRequestStatus = createAction('[Collection] Update Request Status', props<{ requestId: string; status: string }>());
export const updateRequestStatusSuccess = createAction('[Collection] Update Request Status Success', props<{ request: CollectionRequest }>());
export const updateRequestStatusFailure = createAction('[Collection] Update Request Status Failure', props<{ error: any }>());

// Delete request
export const deleteRequest = createAction('[Collection] Delete Request', props<{ requestId: string }>());
export const deleteRequestSuccess = createAction('[Collection] Delete Request Success', props<{ requestId: string }>());
export const deleteRequestFailure = createAction('[Collection] Delete Request Failure', props<{ error: any }>());

// Points Management
export const convertPoints = createAction('[Points] Convert Points', props<{ userId: string; points: number }>());
export const convertPointsSuccess = createAction('[Points] Convert Points Success', props<{ userId: string; voucherValue: number }>());
export const convertPointsFailure = createAction('[Points] Convert Points Failure', props<{ error: any }>());
