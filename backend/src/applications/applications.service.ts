import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Подать заявку на проект
  async create(projectId: string, userId: string) {
    // Проверка: существует ли проект
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Нельзя подать заявку на свой проект
    if (project.ownerId === userId) {
      throw new ForbiddenException('You cannot apply to your own project');
    }

    // Проверка: нет ли уже заявки от этого пользователя на этот проект
    const existing = await this.prisma.application.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
    if (existing) {
      throw new ConflictException('You have already applied to this project');
    }

    return this.prisma.application.create({
      data: {
        projectId,
        userId,
        status: 'PENDING',
      },
    });
  }

  // Все заявки текущего пользователя (где он – заявитель)
  async findByUser(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: { project: true },
    });
  }

  // Все заявки на конкретный проект (только для владельца проекта)
  async findByProject(projectId: string, currentUserId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.ownerId !== currentUserId) {
      throw new ForbiddenException('Only project owner can view applications');
    }
    return this.prisma.application.findMany({
      where: { projectId },
      include: { user: true },
    });
  }

  // Изменить статус заявки (только владелец проекта)
  async updateStatus(id: string, status: string, currentUserId: string) {
    // Находим заявку вместе с проектом
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { project: true },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    if (application.project.ownerId !== currentUserId) {
      throw new ForbiddenException('Only project owner can change application status');
    }
    if (status !== 'ACCEPTED' && status !== 'REJECTED') {
      throw new ForbiddenException('Invalid status value');
    }
    return this.prisma.application.update({
      where: { id },
      data: { status },
    });
  }
}