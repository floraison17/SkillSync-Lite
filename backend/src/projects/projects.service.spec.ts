import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaClient } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

// Мокаем PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: any;

  const mockProject = {
    id: 'test-id-1',
    title: 'Test Project',
    description: 'Test Description',
    category: 'Web',
    ownerId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserId = 'user-1';
  const mockOtherUserId = 'user-2';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prisma = (service as any).prisma;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const createData = {
        title: 'New Project',
        description: 'New Description',
        category: 'Mobile',
        ownerId: mockUserId,
      };

      const expectedProject = { ...mockProject, ...createData };
      prisma.project.create.mockResolvedValue(expectedProject);

      const result = await service.create(createData);

      expect(prisma.project.create).toHaveBeenCalledWith({ data: createData });
      expect(result).toEqual(expectedProject);
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const projects = [mockProject];
      prisma.project.findMany.mockResolvedValue(projects);

      const result = await service.findAll();

      expect(prisma.project.findMany).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated projects with skip and take', async () => {
      const projects = [mockProject];
      prisma.project.findMany.mockResolvedValue(projects);

      const result = await service.findAllPaginated(0, 10);

      expect(prisma.project.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(projects);
    });
  });

  describe('countAll', () => {
    it('should return total count of projects', async () => {
      prisma.project.count.mockResolvedValue(5);

      const result = await service.countAll();

      expect(prisma.project.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });

  describe('findOne', () => {
    it('should return a project if it exists', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);

      const result = await service.findOne(mockProject.id);

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: mockProject.id },
      });
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException if project does not exist', async () => {
      prisma.project.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateData = { title: 'Updated Title' };

    it('should update the project if user is the owner', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);
      const updatedProject = { ...mockProject, ...updateData };
      prisma.project.update.mockResolvedValue(updatedProject);

      const result = await service.update(
        mockProject.id,
        updateData,
        mockUserId,
      );

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: mockProject.id },
      });
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: mockProject.id },
        data: updateData,
      });
      expect(result).toEqual(updatedProject);
    });

    it('should throw NotFoundException if project does not exist', async () => {
      prisma.project.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateData, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);

      await expect(
        service.update(mockProject.id, updateData, mockOtherUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete the project if user is the owner', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);
      prisma.project.delete.mockResolvedValue(mockProject);

      const result = await service.remove(mockProject.id, mockUserId);

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: mockProject.id },
      });
      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: mockProject.id },
      });
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException if project does not exist', async () => {
      prisma.project.findUnique.mockResolvedValue(null);

      await expect(
        service.remove('non-existent-id', mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);

      await expect(
        service.remove(mockProject.id, mockOtherUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});