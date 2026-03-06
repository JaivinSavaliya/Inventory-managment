import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from "class-validator";

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty({ message: "Customer name is required" })
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty({ message: "Phone number is required" })
  @MaxLength(20)
  phone: string;
}

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;
}
