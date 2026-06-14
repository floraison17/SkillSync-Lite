import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
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
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Req() req) {
    // Позже добавим проверку прав
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req) {
    // Позже добавим проверку прав
    return this.projectsService.remove(id);
  }
}