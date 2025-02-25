import {OrderStatusEnum} from '../models/order-status.enum';

export function translateOrderStatusEnumFunction(status: OrderStatusEnum): string {
  switch (status) {
    case OrderStatusEnum.NEW:
      return 'Nuovo';
    case OrderStatusEnum.CANCELLED:
      return 'Annullato';
    case OrderStatusEnum.ACCEPTED:
      return 'Accettato';
    default:
      return status; // Ritorna il valore originale se non trovato
  }
}
