import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
  Optional,
  Type,
  mixin,
} from '@nestjs/common';
import { Multer, Options } from 'multer';
import FastifyMulter from 'fastify-multer';
import { Observable, map } from 'rxjs';

type MulterInstance = any;
export function FileInterceptor(
  fieldName: string,
  localOptions: Options,
): Type<NestInterceptor> {
  class MixinInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS')
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({ ...options, ...localOptions });
      console.log(options);
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) => {
        this.multer.single(fieldName)(
          ctx.getRequest(),
          ctx.getResponse(),
          (error: any) => {
            if (error) {
              return reject(error);
            }
            resolve();
          },
        );
      });
      return next.handle().pipe(map((data) => ({ data })));
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
