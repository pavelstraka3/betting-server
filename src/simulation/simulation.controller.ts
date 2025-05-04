import { Controller, Get, Param } from '@nestjs/common';
import { SimulationService } from './simulation.service';

@Controller('simulation')
export class SimulationController {
    constructor(private readonly simulationService: SimulationService) {}

    @Get("/start/:id")
    startSimulation(@Param('id') id: number) {
        return this.simulationService.startSimulation(id);
    }

    @Get("/stop/:id")
    stopSimulation(@Param('id') id: number) {
        return this.simulationService.stopSimulation(id);
    }
}
