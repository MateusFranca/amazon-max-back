import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

@ValidatorConstraint({ async: false })
export class IsCpfValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) return true;

    return cpf.isValid(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Insira um CPF válido.';
  }
}

export function IsCpfValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsCpfValidConstraint,
    });
  };
}
