import {OrderStatusEnum} from './order-status.enum';

export class GetOrdersResponseModel {
  id!: number;
  code!: string;
  articleCode!: string;
  quantity!: number;
  articleDescription!: string;
  articleSku!: string;
  deliveryAddress!: string;
  deliveryCarrier!: string;
  deliveryDate!: string;
  status!: OrderStatusEnum;
  orderedAt!: string;
}

