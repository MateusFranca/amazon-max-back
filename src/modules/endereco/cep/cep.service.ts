import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CepService {
  async buscarEnderecoPeloCep(cep: string) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
      const resposta = await axios.get(url);

      if (!resposta.data || resposta.data.erro) {
        throw new NotFoundException('CEP não encontrado');
      }

      const { logradouro, bairro, localidade, uf } = resposta.data;

      return {
        street_add: logradouro,
        neighborhood_add: bairro,
        cep_add: cep,
        city: localidade,
        state: uf,
      };
    } catch (error) {
      throw new NotFoundException('CEP não encontrado');
    }
  }
}
