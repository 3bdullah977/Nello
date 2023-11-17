import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloundinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<object> {
    if (file.size > 10000000) throw new BadRequestException('Image size limit');

    if (!file.mimetype.startsWith('image'))
      throw new BadRequestException('File should be image');

    const content = file.buffer;
    return new Promise((resolve, _reject) => {
      cloundinary.uploader
        .upload_stream(
          {
            folder: 'boards_cover',
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
