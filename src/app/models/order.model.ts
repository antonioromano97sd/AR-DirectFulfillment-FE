import { OrderStatus } from './order-status.enum';

export class Order {
  id: number;
  codeOrder: string;
  codeProduct: string;
  quantity: number;
  status: OrderStatus; // enum per evitare errori
  orderDate?: string; //opzionale da rivedere quando arrivano i dati dal be

  constructor(id: number, codeOrder: string, codeProduct: string, quantity: number, status: OrderStatus = OrderStatus.NEW) {
    this.id = id;
    this.codeOrder = codeOrder;
    this.codeProduct = codeProduct;
    this.quantity = quantity;
    this.status = status;
  }
}




export interface Order {
  id: number;
  codeOrder: string;
  codeProduct: string;
  quantity: number;
  status: OrderStatus;
}


