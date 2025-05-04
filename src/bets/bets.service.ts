import { Injectable } from '@nestjs/common';
import { Bet } from './bet.entity';
import { MatchesService } from 'src/matches/matches.service';
import { MatchStatus } from 'src/matches/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BetsService {
    constructor(private matchService: MatchesService, @InjectRepository(Bet) private repository: Repository<Bet>, private userService: UsersService) {}

    public async placeBet(userId: number, matchId: number, betDetails: Bet) {
        // Check status of the match
        const matchStatus: MatchStatus = await this.matchService.getMatchStatus(matchId);
        if (matchStatus !== 'in-progress') {
            throw new Error(`Cannot place bet on match with ID ${matchId} as it is not in progress`);
        }

        // Check if the user has sufficient balance
        const balance = await this.userService.getBalance(userId);
        if (balance < betDetails.amount) {
            throw new Error(`Insufficient balance to place bet of ${betDetails.amount}`);
        }

        const odds = this.calculateOdds(matchId, betDetails.betType, betDetails.selection);
        const bet = this.repository.create({
            ...betDetails,
            user: { id: userId },
            status: 'pending',
            odds,
        });
        await this.repository.save(bet);
    }

    public async resolveBetsForMatch(matchId: number, winningTeam: 'A' | 'B') {
        const bets = await this.getAllBetsForMatch(matchId);
        for (const bet of bets) {
            if (bet.selection === winningTeam) {
                bet.status = 'won';
                bet.payout = bet.amount * bet.odds;
                await this.userService.updateBalance(bet.user.id, bet.payout);
            } else {
                bet.status = 'lost';
            }
            await this.repository.save(bet);
        }
    }

    public async getBetById(betId: number) {
        const bet = await this.repository.findOne({ where: { id: betId }, relations: ['user'] });
        if (!bet) {
            throw new Error(`Bet with ID ${betId} not found`);
        }
        return bet;
    }

    public async getUserBets(userId: number) {
        const bets = await this.repository.find({ where: { user: { id: userId } }, relations: ['user'] });
        if (!bets || bets.length === 0) {
            throw new Error(`No bets found for user with ID ${userId}`);
        }
        return bets;
    }

    public async getAllBetsForMatch(matchId: number) {
        const bets = await this.repository.find({ where: { matchId }, relations: ['user'] });
        if (!bets || bets.length === 0) {
            throw new Error(`No bets found for match with ID ${matchId}`);
        }
        return bets;
    }

    private calculateOdds(matchId: number, betType: string, selection: 'A' | 'B') {
        // Placeholder for actual odds calculation logic
        // In a real-world scenario, this would involve complex calculations based on match data
        return 1.8; // Example odds
    }
}
