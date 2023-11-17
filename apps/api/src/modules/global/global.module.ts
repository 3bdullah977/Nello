import { Global, Module } from '@nestjs/common';
import { DB, DBProvider } from '@/modules/global/providers/db.provider';

@Global()
@Module({
  providers: [DBProvider],
  exports: [DB],
})
export class GlobalModule {}
