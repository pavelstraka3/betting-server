import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bets)
  user: User;

  @Column()
  matchId: number;

  @Column()
  betType: 'match_winner';

  @Column()
  selection: 'A' | 'B';

  @Column('decimal')
  amount: number;

  @Column('decimal')
  odds: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'won' | 'lost';

  @Column({ type: 'decimal', nullable: true })
  payout?: number;

  @CreateDateColumn()
  createdAt: Date;
}
