import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match, MatchStatus } from './match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchesService {
  constructor(@InjectRepository(Match) private repository: Repository<Match>) {}

  async getMatchById(id: number): Promise<Match | null> {
    return this.repository.findOne({ where: { id } });
  }

  async startMatch(matchId: number) {
    const match = await this.repository.findOne({ where: { id: matchId } });
    if (!match) {
      throw new Error(`Match with ID ${matchId} not found`);
    }
    match.status = 'in-progress';
    
    this.repository.save(match);
  }

  async getMatchStatus(matchId: number): Promise<MatchStatus> {
    const match = await this.repository.findOne({ where: { id: matchId } });
    if (!match) {
      throw new Error(`Match with ID ${matchId} not found`);
    }
    return match.status;
  }
}
