import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { Request } from 'express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { JwtPayload } from '../auth/types/jwt-payload.type'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostsService } from './posts.service'

type AuthenticatedRequest = Request & {
  user: JwtPayload
}

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '后台查看全部文章' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllAdmin() {
    return this.postsService.findAllAdmin()
  }

  @ApiOperation({ summary: '后台创建文章' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('admin')
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(req.user.sub, dto)
  }

  @ApiOperation({ summary: '后台更新文章' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, dto)
  }

  @ApiOperation({ summary: '后台删除文章' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id)
  }

  @ApiOperation({ summary: '前台获取已发布文章列表' })
  @Get()
  findPublishedList() {
    return this.postsService.findPublishedList()
  }

  @ApiOperation({ summary: '前台按 slug 获取文章详情' })
  @Get(':slug')
  findPublishedBySlug(@Param('slug') slug: string) {
    return this.postsService.findPublishedBySlug(slug)
  }
}