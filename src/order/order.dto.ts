export class OrderDto {
  requestId: number;
  price: number;
  rows: OrderDetailsType[];
}
type OrderDetailsType = {
  weight: number;
  materialId: number;
};
