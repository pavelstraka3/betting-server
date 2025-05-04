import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    homeTeam: string;

    @Column()
    awayTeam: string;

    @Column({nullable: true})
    homeScore: number;

    @Column({nullable: true})
    awayScore: number;

    @Column()
    status: MatchStatus;

    @Column()
    startTime: Date; // Date and time of the match

    @Column({nullable: true})
    currentTime: Date; // Date and time when the match ended
}

export type MatchStatus = 'scheduled' | 'in-progress' | 'completed';