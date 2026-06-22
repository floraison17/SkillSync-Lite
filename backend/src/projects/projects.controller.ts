import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    const userId = req.user.userId;
    return this.projectsService.create({
      ...createProjectDto,
      ownerId: userId,
    });
  }

  @Get()
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      this.projectsService.findAllPaginated(skip, limitNum),
      this.projectsService.countAll(),
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Req() req) {
    const userId = req.user.userId;
    return this.projectsService.update(id, updateProjectDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.projectsService.remove(id, userId);
  }
}