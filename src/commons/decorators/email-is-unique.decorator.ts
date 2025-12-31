import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from 'src/modules/usuario/usuario.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailIsUniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly usuarioRepository: UsuarioRepository) { }

  async validate(email: string, validationArguments?: ValidationArguments): Promise<boolean> {
    try {
      const usuarioComEmailExistente = await this.usuarioRepository.existeEmail(email);

      return !usuarioComEmailExistente;
    } catch (error) {
      return false;
    }
  }
}

export const EmailIsUnique = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailIsUniqueValidator,
    });
  };
};
