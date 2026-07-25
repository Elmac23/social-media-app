import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { FileDto } from './file.schema';

@Injectable()
export class FilesService {
  constructor(private prismaService: PrismaService) {}

  async getFile(id: string) {
    const file = await this.prismaService.file.findUnique({
      where: {
        id,
      },
    });

    if (!file) throw new NotFoundException(`File with id: ${id} not found!`);

    const filePath = join(process.cwd(), file.path);
    const blob = createReadStream(filePath);

    return new StreamableFile(blob);
  }

  async createFile(fileDto: FileDto, path: string) {
    const { privacy, userId, postId } = fileDto;
    return await this.prismaService.file.create({
      data: {
        privacy,
        path,
        postId,
        userId,
      },
    });
  }

  async updateFile(fileId: string, data: Partial<FileDto>) {
    return await this.prismaService.file.update({
      where: { id: fileId },
      data,
    });
  }

  async deleteFile(fileId: string) {
    const file = await this.prismaService.file.findUnique({
      where: { id: fileId },
    });

    if (!file)
      throw new NotFoundException(`File with id: ${fileId} not found!`);
    try {
      await unlink(join(process.cwd(), 'files/', file.path));
    } catch (err) {
      console.error('Error deleting file from filesystem:', err);
    }

    return await this.prismaService.file.delete({
      where: { id: fileId },
    });
  }
}
