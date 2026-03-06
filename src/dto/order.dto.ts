import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";

export class OrderItemDto {
  @IsInt()
  @IsNotEmpty({ message: "Product ID is required" })
  product_id: number;

  @IsInt()
  @Min(1, { message: "Quantity must be at least 1" })
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  manual_price?: number; // If not provided, uses the product's current price
}

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  customer_id?: number | null;

  @IsArray()
  @ArrayMinSize(1, { message: "Order must have at least one item" })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderDto {
  @IsOptional()
  @IsInt()
  customer_id?: number | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}
