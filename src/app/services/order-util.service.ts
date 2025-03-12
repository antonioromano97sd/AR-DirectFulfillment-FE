import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderUtilService {

  public globalWarehouseSelected: BehaviorSubject<string> = new BehaviorSubject<string>('ALL');

  constructor() { }

  public setGlobalWarehouse(warehouse: string): void {
    this.globalWarehouseSelected.next(warehouse);
  }

}
