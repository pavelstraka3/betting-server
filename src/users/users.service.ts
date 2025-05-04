import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repository: Repository<User>) {}

    public async getUserById(userId: number) {
        const user = await this.repository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        return user;
    }

    public async getBalance(userId: number) {
        const user = await this.getUserById(userId);
        return user.balance;
    }

    public async updateBalance(userId: number, amount: number) {
        const user = await this.getUserById(userId);
        user.balance += amount;
        await this.repository.save(user);
        return user.balance;
    }
    
    public async createUser(username: string, initialBalance: number) {
        const user = this.repository.create({ username, balance: initialBalance });
        await this.repository.save(user);
        return user;
    }
}
