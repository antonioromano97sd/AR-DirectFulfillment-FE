import { TestBed } from '@angular/core/testing';

import { OrderUtilService } from './order-util.service';

describe('OrderUtilService', () => {
  let service: OrderUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
