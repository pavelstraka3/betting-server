import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { MatchesModule } from 'src/matches/matches.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from './bet.entity';
import { UsersModule } from 'src/users/users.module';
import { BetsController } from './bets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bet]), MatchesModule, UsersModule],
  providers: [BetsService],
  controllers: [BetsController],
})
export class BetsModule {}
