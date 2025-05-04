import {
    ConnectedSocket,
    MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchSnapshot } from 'src/simulation/simulation.engine';

@WebSocketGateway({
  cors: {
    origin: "*"
  },
})
export class ScoreGateway {
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage("subscribe_to_match")
  handleSubscribe(@MessageBody() payload: { matchId: number },  @ConnectedSocket() client: Socket,) {
    console.log(`Client ${client.id} subscribed to match ${payload.matchId}`);
    client.join(`match_${payload.matchId}`);
    client.emit('subscribed', payload.matchId);
  }

  @SubscribeMessage('unsubscribe_from_match')
  handleUnsubscribe(
    @MessageBody() payload: { matchId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Client ${client.id} unsubscribed from match ${payload.matchId}`);
    client.emit('unsubscribed', payload.matchId);
    client.leave(`match_${payload.matchId}`);
  }

  emitMatchStarted(match: MatchMetadata) {
    this.server.to(`match_${match.matchId}`).emit('match_started', match);
  }

  emitGoal(matchId: number, team: string) {
    this.server.to(`match_${matchId}`).emit('goal', { matchId, team });
  }

  broadcastMatchUpdate(snapshot: MatchSnapshot) {
    this.server.to(`match_${snapshot.matchId}`).emit('match_update', snapshot);
  }

  emitMatchFinished(matchId: string, finalScore: { A: number; B: number }) {
    this.server.to(`match_${matchId}`).emit('match_finished', { matchId, finalScore });
  }
}

export interface MatchMetadata {
  matchId: number;
  teamA: string;
  teamB: string;
  startTime: string;
}
