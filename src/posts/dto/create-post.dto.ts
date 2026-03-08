import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreatePostDto {
  @ApiProperty({ example: '我的第一篇博客' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title: string

  @ApiProperty({ example: 'my-first-post' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug 只能包含小写字母、数字和中划线',
  })
  slug: string

  @ApiPropertyOptional({ example: '这是文章摘要' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  summary?: string

  @ApiProperty({ example: '这是正文内容' })
  @IsString()
  content: string

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean
}