import { promises as fs } from 'fs';
import * as path from 'path';

export async function enviarArquivoLocal(
  buffer: Buffer,
  nomeArquivo: string,
  metodo: string,
): Promise<{ nomeArquivo: string; linkArquivo: string }> {
  const uploadRoot = path.resolve(process.cwd(), 'uploads');
  const dir = path.join(uploadRoot, metodo);

  await fs.mkdir(dir, { recursive: true });

  const filePath = path.join(dir, nomeArquivo);
  await fs.writeFile(filePath, buffer);

  const linkArquivo = `/uploads/${metodo}/${encodeURIComponent(nomeArquivo)}`;

  return {
    nomeArquivo,
    linkArquivo,
  };
}
