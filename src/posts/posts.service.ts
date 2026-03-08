import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublishedList() {
    return this.prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async findPublishedBySlug(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!post) {
      throw new NotFoundException('文章不存在或未发布')
    }

    return post
  }

  async findAllAdmin() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async create(authorId: number, dto: CreatePostDto) {
    try {
      return await this.prisma.post.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          summary: dto.summary,
          content: dto.content,
          coverImage: dto.coverImage,
          published: dto.published ?? false,
          publishedAt: dto.published ? new Date() : null,
          authorId,
        },
      })
    } catch (error: unknown) {
      this.handlePrismaError(error)
    }
  }

  async update(id: number, dto: UpdatePostDto) {
    const existing = await this.prisma.post.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('文章不存在')
    }

    const nextPublished =
      dto.published === undefined ? existing.published : dto.published

    const nextPublishedAt =
      dto.published === undefined
        ? existing.publishedAt
        : dto.published
          ? existing.publishedAt ?? new Date()
          : null

    try {
      return await this.prisma.post.update({
        where: { id },
        data: {
          title: dto.title,
          slug: dto.slug,
          summary: dto.summary,
          content: dto.content,
          coverImage: dto.coverImage,
          published: nextPublished,
          publishedAt: nextPublishedAt,
        },
      })
    } catch (error: unknown) {
      this.handlePrismaError(error)
    }
  }

  async remove(id: number) {
    const existing = await this.prisma.post.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('文章不存在')
    }

    return this.prisma.post.delete({
      where: { id },
    })
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('slug 已存在，请更换')
      }
    }

    throw error
  }
}