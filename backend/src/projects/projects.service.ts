import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProjectsService {
  private prisma = new PrismaClient();

  async create(data: { title: string; description: string; category: string; ownerId: string }) {
    return this.prisma.project.create({ data });
  }

  async findAll() {
    return this.prisma.project.findMany();
  }

  async findAllPaginated(skip: number, take: number) {
    return this.prisma.project.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countAll() {
    return this.prisma.project.count();
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, updateData: { title?: string; description?: string; category?: string }, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this project');
    }
    return this.prisma.project.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner of this project');
    }
    return this.prisma.project.delete({ where: { id } });
  }
}