import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { diskStorage } from 'multer'
import { extname } from 'path'

class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any
}

function createFilename(
  _req: any,
  file: any,
  callback: (error: Error | null, filename: string) => void,
) {
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  callback(null, `${uniqueName}${extname(file.originalname)}`)
}

@ApiTags('upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传封面图',
    type: UploadImageDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: createFilename,
      }),
    }),
  )
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|webp)$/,
            skipMagicNumbersValidation: true,
          }),
        ],
      }),
    )
    file: any,
  ) {
    return {
      filename: file.filename,
      url: `http://localhost:3001/uploads/${file.filename}`,
    }
  }
}