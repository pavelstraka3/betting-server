import { Injectable } from '@nestjs/common';
import { MatchSnapshot, SimulationEngine } from './simulation.engine';
import { MatchesService } from 'src/matches/matches.service';
import { ScoreGateway } from 'src/websocket/score.gateway';
import { BetsService } from 'src/bets/bets.service';

const TICK_INTERVAL_MS = 1000;

@Injectable()
export class SimulationService {
  private activeSimulations = new Map<
    number,
    {
      engine: SimulationEngine;
      timer: NodeJS.Timeout;
    }
  >();

  constructor(
    private readonly matchService: MatchesService,
    private readonly scoreGateway: ScoreGateway,
    private readonly betsService: BetsService,
  ) {
    this.startSimulation(2);
  }

  public async startSimulation(matchId: number): Promise<void> {
    const match = await this.matchService.getMatchById(matchId);

    if (!match) {
      throw new Error(`Match with ID ${matchId} not found`);
    }

    return new Promise((resolve, reject) => {
      const engine = new SimulationEngine({
        matchId: matchId,
        teamAName: match.homeTeam,
        teamBName: match.awayTeam,
      });
      const timer = setInterval(() => {
        this.simulateTick(matchId);
      }, TICK_INTERVAL_MS); // Simulate every second

      this.activeSimulations.set(matchId, { engine, timer });
      console.log(`Simulation started for match ID: ${matchId}`);

      this.matchService.startMatch(matchId);
      this.scoreGateway.emitMatchStarted({
        matchId: matchId,
        teamA: match.homeTeam,
        teamB: match.awayTeam,
        startTime: new Date().toISOString(),
      });

      resolve(); // Resolve the promise when the simulation starts
    });
  }

  private simulateTick(matchId: number): void {
    const engine = this.activeSimulations.get(matchId)?.engine;
    if (!engine) return;

    const result = engine.tick();
    console.log(`Tick for match ID: ${matchId}`, result);

    if (result.goalEvent) {
      const team = result.goalEvent.team === 'A' ? 'home' : 'away';
      this.scoreGateway.emitGoal(matchId, team);
    }
    // Update match in the database with the result

    this.scoreGateway.broadcastMatchUpdate({
      matchId: matchId,
      scoreA: result.scoreA,
      scoreB: result.scoreB,
      currentMinute: result.currentTime,
      isFinished: result.isFinished,
      powerPlay: result.powerPlay || null,
    });

    if (result.isFinished) {
      let winner: 'A' | 'B';
      if (result.scoreA === result.scoreB) {
        // if overtime pick a random winner
        winner = Math.random() < 0.5 ? 'A' : 'B';
      } else {
        winner = result.scoreA > result.scoreB ? 'A' : 'B';
      }

      console.log(
        `Match ID: ${matchId} finished with score ${result.scoreA}:${result.scoreB}`,
      );

      this.stopSimulation(matchId);
      this.betsService.resolveBetsForMatch(matchId, winner);
    }
  }

  public stopSimulation(matchId: number): void {
    const simulation = this.activeSimulations.get(matchId);
    if (simulation) {
      clearInterval(simulation.timer);
      this.activeSimulations.delete(matchId);
    }
    console.log(`Simulation finished for match ID: ${matchId}`);
  }

  private getSImulationState(matchId: number): MatchSnapshot | null {
    const simulation = this.activeSimulations.get(matchId);
    if (simulation) {
      return simulation.engine.getState();
    }
    return null;
  }
}
