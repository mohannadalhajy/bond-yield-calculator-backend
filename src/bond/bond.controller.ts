import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import { BondResultDto } from './dto/bond-result.dto';
import { BondService } from './bond.service';

@ApiTags('bond')
@Controller('bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CalculateBondDto })
  @ApiOkResponse({ type: BondResultDto })
  calculate(@Body() calculateBondDto: CalculateBondDto): BondResultDto {
    return this.bondService.calculateBondMetrics(calculateBondDto);
  }
}
