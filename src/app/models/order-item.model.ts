import {GetOrdersResponseModel} from './order.model';

export class GetOrderItemResponseModel {
  id!: string;
  order!: GetOrdersResponseModel;
  code!: string;
  sku!: string;
  description!: string;
  images!: string;
  quantity!: number;
  ean!: string;
  gtin!: string;
  color!: string;
  brandName!: string;
  modelNumber!: string;
  partNumber!: string;
  packageQuantity!: number;
  size!: string;
}

