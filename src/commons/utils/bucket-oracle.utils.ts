import * as objectstorage from "oci-objectstorage";
import * as common from "oci-common";
import { DateTime } from "luxon";

const provider = new common.ConfigFileAuthenticationDetailsProvider();

export async function enviarArquivoOracle(
    buffer: Buffer,
    nomeArquivo: string,
    id: string
): Promise<{ nomeArquivo: string; linkArquivo: string; dataEnvio: string }> {
    const namespace = "gr500xifmria";
    const bucketName = "bucket-pessoal";
    const objectName = `AmazonMax/Produtos/${id}/${nomeArquivo}`;

    try {
        const client = new objectstorage.ObjectStorageClient({
            authenticationDetailsProvider: provider,
        });

        const putObjectRequest: objectstorage.requests.PutObjectRequest = {
            namespaceName: namespace,
            bucketName: bucketName,
            objectName: objectName,
            contentLength: buffer.length,
            putObjectBody: buffer,
        };

        await client.putObject(putObjectRequest);

        const region = "sa-saopaulo-1";
        const linkArquivo = `https://objectstorage.${region}.oraclecloud.com/n/${namespace}/b/${bucketName}/o/${encodeURIComponent(
            objectName
        )}`;

        return {
            nomeArquivo: nomeArquivo,
            linkArquivo: linkArquivo,
            dataEnvio: DateTime.now().setZone("America/Sao_Paulo").toISO(),
        };
    } catch (error: any) {
        throw error;
    }
}
