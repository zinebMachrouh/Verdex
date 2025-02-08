export interface CollectionRequest {
  id?: string;
  types: string[];
  weight: number;
  address: string;
  preferredDateTime: Date;
  notes?: string;
  status: string;
  userId: string;
  collectorId?: string;
  photos?: string[];
}
