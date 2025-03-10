import {OrderStatusEnum} from './order-status.enum';

export class GetOrdersResponseModel {
  id!: number;
  code!: string;
  articleCode!: string;
  quantity!: number;
  articleDescription!: string;
  articleSKU!: string;
  deliveryAddress!: string;
  deliveryCarrier!: string;
  deliveryDate!: string;
  status!: OrderStatusEnum;
  orderedAt!: string;
  images!: string[];
}

