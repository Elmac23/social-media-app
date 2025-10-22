import { Controller } from '@nestjs/common';
import { GroupChatsService } from './group-chats.service';

@Controller('group-chats')
export class GroupChatsController {
  constructor(private groupChatsService: GroupChatsService) {}
}
