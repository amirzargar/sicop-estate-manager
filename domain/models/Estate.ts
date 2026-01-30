
import { EstateDTO, UnitDTO } from '../../shared/types';

export class Estate {
  constructor(private props: EstateDTO, private units: UnitDTO[]) {}

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get totalCapacity() { return this.props.totalUnits; }

  getOccupancyRate(): number {
    if (this.props.totalUnits === 0) return 0;
    return (this.units.length / this.props.totalUnits) * 100;
  }

  isAtFullCapacity(): boolean {
    return this.units.length >= this.props.totalUnits;
  }

  toDTO(): EstateDTO {
    return { ...this.props };
  }
}
