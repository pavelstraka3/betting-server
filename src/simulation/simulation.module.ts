import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { MatchesModule } from 'src/matches/matches.module';
import { ScoreGateway } from 'src/websocket/score.gateway';
import { SimulationController } from './simulation.controller';
import { BetsModule } from 'src/bets/bets.module';

@Module({
  imports: [MatchesModule, BetsModule],
  providers: [SimulationService, ScoreGateway],
  controllers: [SimulationController],
})
export class SimulationModule {}
