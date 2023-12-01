import { BadRequestException, Injectable } from '@nestjs/common';
import { cloudinary } from './cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folderName: 'boards_cover' | 'cards_cover',
  ): Promise<object> {
    console.log(cloudinary.config.call(this));
    if (file.size > 10000000) throw new BadRequestException('Image size limit');

    if (!file.mimetype.startsWith('image'))
      throw new BadRequestException('File should be image');

    const content = file.buffer;
    return new Promise((resolve, _reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folderName,
          },
          (error, result) => {
            if (error) {
              throw new BadRequestException('Upload picture failed');
            } else {
              resolve(result);
            }
          },
        )
        .end(content);
    });
  }
}
