import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

export class UpdatePostDto {
  @ApiPropertyOptional({ example: '更新后的标题' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title?: string

  @ApiPropertyOptional({ example: 'updated-post-slug' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug 只能包含小写字母、数字和中划线',
  })
  slug?: string

  @ApiPropertyOptional({ example: '更新后的摘要' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  summary?: string

  @ApiPropertyOptional({ example: '更新后的正文内容' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiPropertyOptional({ example: 'https://example.com/new-cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean
}