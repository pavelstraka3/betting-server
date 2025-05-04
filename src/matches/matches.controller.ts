import { Controller, Get, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) {}

    @Get("/:id")
    getMatchById(@Param('id') id: number) {
        // Validate the id parameter
        if (isNaN(id)) {
            throw new Error("Invalid match ID");
        }

        return this.matchesService.getMatchById(id); 
    }
}
