import {OrderStatusEnum} from './order-status.enum';

export class UpdateStatusRequestModel {
  orderId!: number
  status!: OrderStatusEnum
  motivation?: string
}
