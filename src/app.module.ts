import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchesModule } from './matches/matches.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './matches/match.entity';
import { SimulationModule } from './simulation/simulation.module';
import { WebsocketModule } from './websocket/websocket.module';
import { UsersModule } from './users/users.module';
import { BetsModule } from './bets/bets.module';
import { User } from './users/user.entity';
import { Bet } from './bets/bet.entity';

@Module({
  imports: [MatchesModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "admin",
    password: "aaa",
    database: "better",
    entities: [Match, User, Bet],
    synchronize: true, // Set to false in production
  }), SimulationModule, WebsocketModule, UsersModule, BetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
