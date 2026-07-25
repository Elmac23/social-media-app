import { Controller, Get, Param } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get(':id')
  async getFile(@Param('id') id: string) {
    return this.filesService.getFile(id);
  }
}
