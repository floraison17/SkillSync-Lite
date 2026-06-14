import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // POST /applications - подать заявку на проект (в теле { projectId })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: { projectId: string }, @Req() req) {
    const userId = req.user.userId;
    return this.applicationsService.create(body.projectId, userId);
  }

  // GET /applications/my - мои заявки
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  async getMyApplications(@Req() req) {
    const userId = req.user.userId;
    return this.applicationsService.findByUser(userId);
  }

  // GET /applications/project/:projectId - заявки на проект (только владелец)
  @Get('project/:projectId')
  @UseGuards(AuthGuard('jwt'))
  async getProjectApplications(@Param('projectId') projectId: string, @Req() req) {
    const userId = req.user.userId;
    return this.applicationsService.findByProject(projectId, userId);
  }

  // PATCH /applications/:id - изменить статус (в теле { status: "ACCEPTED" или "REJECTED" })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Req() req) {
    const userId = req.user.userId;
    return this.applicationsService.updateStatus(id, body.status, userId);
  }
}