
export class Order {
  id: number;
  numOrder: string;
  codArticle: string;
  quantity: number;
  orderDate: string; // O può essere anche Date se preferisci trattarlo come oggetto Date

  constructor(id: number, numOrder: string, codArticle: string, quantity: number, orderDate: string) {
    this.id = id;
    this.numOrder = numOrder;
    this.codArticle = codArticle;
    this.quantity = quantity;
    this.orderDate = orderDate;
  }
}
