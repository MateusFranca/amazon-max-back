import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { CidadeRepository } from 'src/modules/base/cidade/cidade.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class UuidExists implements ValidatorConstraintInterface {
  constructor(
    private readonly cityRepository: CidadeRepository,
  ) {}

  async validate(ids: string | string[], { property }: ValidationArguments): Promise<boolean> {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    const repositories = {
      id_cid_fk: this.cityRepository,
    };

    const repo = repositories[property];
    if (!repo) return false;

    const results = await Promise.all(idsArray.map((id) => repo.existe(id)));

    return results.includes(true);
  }
}

export function IsUuidExists(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: UuidExists,
    });
  };
}
