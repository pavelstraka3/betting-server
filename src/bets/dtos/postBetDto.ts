import { IsNotEmpty } from "class-validator";

export class postBetDto {
    @IsNotEmpty()
    matchId: number;

    @IsNotEmpty()
    selection: 'A' | 'B';

    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    userId: number;
}