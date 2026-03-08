import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import {
  createQuerySchemaWithOrderedBy,
  querySchema,
} from 'src/schemas/query.schema';
import { ZodType } from 'zod';

export class QueryPipe implements PipeTransform {
  private _schema: ZodType;
  constructor(private keys?: readonly string[]) {
    if (keys) this._schema = createQuerySchemaWithOrderedBy(keys);
    else this._schema = querySchema;
  }

  async transform(value: unknown, metadata: ArgumentMetadata) {
    const result = await this._schema.safeParseAsync(value);

    console.log(value);

    if (!result.success) throw new BadRequestException(result.error);

    return result.data;
  }
}
