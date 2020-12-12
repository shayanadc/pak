import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty()
  requestId: number;
  @ApiProperty()
  price: number;
  @ApiProperty({ type: () => OrderDetailsType })
  rows: OrderDetailsType[];
}
class OrderDetailsType {
  @ApiProperty()
  weight: number;
  @ApiProperty()
  materialId: number;
}
