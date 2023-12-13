import { FactoryProvider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { CloudinaryConfig } from '@/config';

export const cloudinary = v2;

const CLOUDINARY = Symbol('CLOUDINARY_SERVICE');

export const CloudinaryProvider: FactoryProvider = {
  provide: CLOUDINARY,
  inject: [CloudinaryConfig.KEY],
  useFactory: (cloudinaryConfig: ConfigType<typeof CloudinaryConfig>) => {
    return cloudinary.config(cloudinaryConfig);
  },
};
