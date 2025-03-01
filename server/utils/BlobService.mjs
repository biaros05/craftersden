import { BlobServiceClient} from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config();

const sasToken = process.env.AZURE_SAS;
const containerName = process.env.AZURE_BLOB_CONTAINER || 'imageblob';
const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT || 'nameofyourstorageaccount';


class BlobServiceProvider {
  #blobServiceClient;
  #containerClient;
  static blobPublicUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/`;

  constructor() {
    this.initializeFields();
  }

  initializeFields() {
    this.#blobServiceClient = this.#getBlobServiceClient();
    this.#containerClient = this.#getContainerClient(this.#blobServiceClient);
  }

  #getBlobServiceClient() {
    return new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );
  }

  #getContainerClient(blobServiceClient) {
    return blobServiceClient.getContainerClient(containerName);
  }

  async saveFile(file) {
    const name = file.originalname;

    const blobClient = this.#containerClient.getBlockBlobClient(name);

    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.mimetype } };

    await blobClient.uploadData(file.buffer, options);
    const fullUrl = BlobServiceProvider.blobPublicUrl + name;

    return fullUrl;
  }

  async overrideFile(file, blobName) {
    const blobClient = this.#containerClient.getBlockBlobClient(blobName);
    const options = { blobHTTPHeaders: { blobContentType: file.mimetype }, overwrite: true };
    await blobClient.uploadData(file.buffer, options);
    const fullUrl = BlobServiceProvider.blobPublicUrl + blobName;
    return fullUrl;
  }
}

export default BlobServiceProvider;