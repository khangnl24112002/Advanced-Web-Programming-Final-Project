// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadFile({
    file,
    filename,
    buffer,
  }: {
    file?: Express.Multer.File,
    filename?: string,
    buffer?: Buffer,
  }): Promise<CloudinaryResponse> {
    const originalFilename = !filename ? Buffer.from(file.originalname, 'ascii').toString('utf8') : filename;

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', filename_override: originalFilename },
        (error, result) => {
          if (error) {
            console.log('@@@', error);
            return reject(error);
          }
          resolve(result);
        },
      );
      streamifier.createReadStream(!buffer ? file.buffer : buffer).pipe(uploadStream);
    });
  }
}
