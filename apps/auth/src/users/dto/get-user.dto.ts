import { IsNumber } from "class-validator";

export class GetUserDto {
    @IsNumber()
    id: number
}