import { FactoryProvider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { CloudinaryConfig } from '@/config';

const CLOUDINARY = Symbol('CLOUDINARY_SERVICE');

export const CloudinaryProvider: FactoryProvider = {
  provide: CLOUDINARY,
  useFactory: (cloudinaryConfig: ConfigType<typeof CloudinaryConfig>) => {
    return v2.config(cloudinaryConfig);
  },
};
