import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderUtilService {
  private warehouseSubject = new BehaviorSubject<string>('ALL');
  globalWarehouseSelected = this.warehouseSubject.asObservable();

  setGlobalWarehouse(warehouse: string) {
    this.warehouseSubject.next(warehouse);
  }
}
