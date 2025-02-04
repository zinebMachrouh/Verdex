import { TestBed } from '@angular/core/testing';

import { IndxeddbService } from './indxeddb.service';

describe('IndxeddbService', () => {
  let service: IndxeddbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndxeddbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
