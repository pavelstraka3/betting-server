export class SimulationEngine {
  private matchId: number;
  private scoreA: number;
  private scoreB: number;
  private currentTime: number;
  private isFinished: boolean;
  private powerPlay: PowerPlay | null = null;

  private teamAName: string;
  private teamBName: string;
  private duration: number = 60; // Duration of the match in minutes
  private goalChance: number = 0.08; // per minute chance for team to score a goal
  private chanceOfPenalty: number = 0.05; // per minute chance for team to get a penalty

  constructor(initialData: MatchSimulationInitData) {
    this.matchId = initialData.matchId;
    this.teamAName = initialData.teamAName;
    this.teamBName = initialData.teamBName;
    this.scoreA = 0;
    this.scoreB = 0;
    this.currentTime = 0; // in minutes
    this.isFinished = false;
  }

  public tick() {
    this.currentTime += 1; // Increment the current time by 1 minute
    if (this.currentTime >= this.duration) {
      this.isFinished = true;

      return {
        matchId: this.matchId,
        scoreA: this.scoreA,
        scoreB: this.scoreB,
        goalEvent: null,
        currentTime: this.duration,
        isFinished: this.isFinished,
      };
    }

    // Simulate goal events for both teams
    const goalEvent = this.getGoalEvent();

    if (goalEvent) {
      if (goalEvent.team === 'A') {
        this.scoreA += 1;
      } else {
        this.scoreB += 1;
      }
    }

    if (!this.powerPlay && Math.random() < this.chanceOfPenalty) {
      const teamWithAdvantage = Math.random() < 0.5 ? 'A' : 'B';
      this.powerPlay = {
        duration: 2,
        startAtMinute: this.currentTime,
        team: teamWithAdvantage,
      };
    }

    return {
      matchId: this.matchId,
      scoreA: this.scoreA,
      scoreB: this.scoreB,
      goalEvent: goalEvent,
      currentTime: this.currentTime,
      isFinished: this.isFinished,
      powerPlay: this.powerPlay,
    };
  }

  public isComplete(): boolean {
    return this.isFinished;
  }

  public getState(): MatchSnapshot {
    return {
      matchId: this.matchId,
      currentMinute: this.currentTime,
      scoreA: this.scoreA,
      scoreB: this.scoreB,
      isFinished: this.isFinished,
      powerPlay: this.powerPlay,
    };
  }

  private getGoalEvent(): GoalEvent | null {
    const { teamA, teamB } = this.getGoalChance();

    const rand = Math.random();

    if (rand < teamA) {
      return {
        team: 'A',
        minute: this.currentTime,
        powerPlay: this.isPowerPlay(),
      };
    } else if (rand < teamA + teamB) {
      return {
        team: 'B',
        minute: this.currentTime,
        powerPlay: this.isPowerPlay(),
      };
    }

    return null;
  }

  private getGoalChance(): { teamA: number; teamB: number } {
    const isPowerPlay =
      this.powerPlay &&
      this.currentTime - this.powerPlay.startAtMinute < this.powerPlay.duration;
    if (!isPowerPlay) {
      return { teamA: this.goalChance, teamB: this.goalChance };
    }

    const powerPlayBonus = 0.07;

    const teamAScoreChance =
      this.goalChance +
      (isPowerPlay && this.powerPlay?.team === 'A' ? powerPlayBonus : 0);
    const teamBScoreChance =
      this.goalChance +
      (isPowerPlay && this.powerPlay?.team === 'B' ? powerPlayBonus : 0);

    return {
      teamA: teamAScoreChance,
      teamB: teamBScoreChance,
    };
  }

  public isPowerPlay(): boolean {
    return this.powerPlay !== null;
  }
}

export interface PowerPlay {
  team: 'A' | 'B';
  startAtMinute: number;
  duration: number; // 2, 4 or 5 minutes
}

export interface MatchSimulationInitData {
  matchId: number;
  teamAName: string;
  teamBName: string;
  startMinute?: number;
  scoreA?: number;
  scoreB?: number;
}

export interface SimulationTickResult {
  matchId: number;
  scoreA: number;
  scoreB: number;
  goalEvent: { team: 'A' | 'B' } | null;
  currentTime: number; // in minutes
  isFinished: boolean;
}

export interface MatchSnapshot {
  matchId: number;
  currentMinute: number;
  scoreA: number;
  scoreB: number;
  isFinished: boolean;
  powerPlay: PowerPlay | null;
}

interface GoalEvent {
  team: 'A' | 'B';
  minute: number; // minute when the goal was scored
  powerPlay: boolean; // was it a power play goal?
}
