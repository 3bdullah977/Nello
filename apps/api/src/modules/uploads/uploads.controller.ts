import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import SingleFileDto from './dto/single-file.dto';
import { fileMapper } from '@/utils/file-mapper-util';
import { FileInterceptor } from './file-interceptor';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '@/utils/file-upload-util';

@ApiTags('Upload File')
@Controller('uploads')
export class UploadsController {
  @ApiConsumes('multipart/form-data')
  @Post('single-file')
  @UseInterceptors(
    FileInterceptor('photoUrl', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  singleFile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: SingleFileDto,
  ) {
    return { ...body, photoUrl: fileMapper({ file, req }) };
  }
}
