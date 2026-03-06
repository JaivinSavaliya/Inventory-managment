import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: "Product name is required" })
  @MaxLength(255)
  product_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be a valid number with at most 2 decimal places" })
  @Min(0, { message: "Price must be a positive number" })
  price: number;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  product_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0, { message: "Price must be a positive number" })
  price?: number;
}
