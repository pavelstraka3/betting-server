import { Body, Controller, Post } from '@nestjs/common';
import { BetsService } from './bets.service';
import { postBetDto } from './dtos/postBetDto';
import { Bet } from './bet.entity';

@Controller('bets')
export class BetsController {
    constructor(private betsService: BetsService) {}

    @Post()
    async betsPost(@Body() postBetDto: postBetDto) {
        const bet: Bet = new Bet();
        bet.amount = postBetDto.amount;
        bet.betType = "match_winner";
        bet.selection = postBetDto.selection;

        await this.betsService.placeBet(postBetDto.userId, postBetDto.matchId, bet);
        
        return {
            message: 'Bet placed successfully',
            bet: {
                matchId: postBetDto.matchId,
                selection: postBetDto.selection,
                amount: postBetDto.amount,
                userId: postBetDto.userId,
            },
        };
    }
}
