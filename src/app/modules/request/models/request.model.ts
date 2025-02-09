export interface CollectionRequest {
  id?: string;
  types: string[];
  weight: number;
  address: string;
  schedule: string;
  notes?: string;
  status: string;
  userId: string;
  collectorId?: string;
  photos?: string;
}
