import imageAnnotatorClient from '@src/loaders/imageAnnotatorClient';
import { Service } from 'typedi';
import { sceneBucket } from './storage';

@Service()
export default class SceneService {
  private generateRandomName() {
    return Math.random().toString(36).slice(2);
  }

  /**
   * upload image to scene bucket
   * @param image from multer
   * @returns bucket url
   */
  private async uploadImage(image: Buffer, name: string): Promise<string> {
    const blob = sceneBucket.file(`${this.generateRandomName()}_${name}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream.end(image);
    return new Promise((resolve, reject) => {
      blobStream.on('error', reject);
      blobStream.on('finish', () => {
        resolve(`gs://${blob.bucket.name}/${blob.name}`);
      });
    });
  }

  public async labelDetection(file: Express.Multer.File) {
    const url = await this.uploadImage(file.buffer, file.originalname);
    const [result] = await imageAnnotatorClient.labelDetection(url);
    return result.labelAnnotations
      ?.map((label) => label.description)
      .filter((description): description is string => !!description);
  }
}
