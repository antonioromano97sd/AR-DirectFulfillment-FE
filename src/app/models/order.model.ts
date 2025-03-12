import {OrderStatusEnum} from './order-status.enum';
import {GetOrderItemResponseModel} from './order-item.model';

export class GetOrdersResponseModel {
  id!: number;
  code!: string;
  deliveryAddress!: string;
  deliveryCarrier!: string;
  deliveryDate!: string;
  status!: OrderStatusEnum;
  orderedAt!: string;
  items!: GetOrderItemResponseModel[];
  warehouse: any;
}

