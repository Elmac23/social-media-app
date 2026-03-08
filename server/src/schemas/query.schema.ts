import z, { union } from 'zod';

export const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, { message: 'Page must be greater than 0' }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
  search: z.string().optional(),
});

export function createQuerySchemaWithOrderedBy(keys: readonly string[]) {
  return querySchema.extend({
    orderBy: z
      .union([
        z.templateLiteral([z.enum(keys), '-', z.enum(['asc', 'desc'])]),
        z.templateLiteral(['']),
      ])

      .optional(),
  });
}
