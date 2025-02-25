import {OrderStatusEnum} from './order-status.enum';

export class GetOrdersResponseModel {
  id!: number;
  code!: string;
  articleCode!: string;
  quantity!: number;
  status!: OrderStatusEnum;
  orderedAt!: string;
}

