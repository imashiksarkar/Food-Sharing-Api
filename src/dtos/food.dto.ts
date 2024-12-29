import z from 'zod'

export const foodCategory = [
  'breakfast',
  'lunch',
  'dinner',
  'snacks',
  'drinks',
] as const

export const foodStatus = ['available', 'unavailable'] as const

const getMinDate = () => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 30) // add 30 minutes
  return date
}

const addFoodDto = z.object({
  name: z.string().trim().min(3, 'Name must be 3 chars or more.'),
  imageUrl: z.string().trim().url('Invalid url.'),
  category: z.enum(foodCategory),
  expiresAt: z.preprocess(
    (value) => (typeof value === 'string' ? new Date(value) : value),
    z
      .date()
      .min(getMinDate(), 'Expires at must be at least 30 minutes from now.')
  ),
  pickupLocation: z
    .string()
    .trim()
    .min(3, 'Pickup location must be 3 chars or more.'),
  additionalNotes: z
    .string()
    .trim()
    .min(3, 'Additional notes must be 3 chars or more.'),
  foodStatus: z.enum(foodStatus).optional(),
  quantity: z.number().min(50, 'Quantity must be at least 50 grams.'),
})

const dbQuerySchema = z.preprocess(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (rawQuery: any) => {
    rawQuery._id = rawQuery.id
    delete rawQuery.id

    const { fields, skip, limit, sort, select, ...query } = rawQuery

    const parsedQuery = {
      fields,
      skip,
      limit,
      sort,
      select,
      query,
    }

    return parsedQuery
  },
  z.object({
    fields: z
      .string()
      .trim()
      .transform((fields) => fields?.split(','))
      .optional(),
    skip: z
      .preprocess(
        (value) => (typeof value === 'string' ? parseInt(value) : value),
        z.number().min(0, 'Skip must be at least 0.')
      )
      .optional(),
    limit: z.preprocess(
      (value) => (typeof value === 'string' ? parseInt(value) : value),
      z.number().min(2, 'Limit must be at least 2.').optional()
    ),
    sort: z
      .string()
      .transform((sort) => sort?.split(',').join(' '))
      .optional(),
    select: z
      .string()
      .transform((select) => select?.split(',').join(' '))
      .optional(),
    query: z
      .object({
        foodStatus: z.enum(foodStatus).optional(),
        quantity: z
          .any()
          .transform((quantity, ctx) => {
            if (typeof quantity === 'object') {
              const {
                data: operator,
                error,
                success,
              } = z
                .record(
                  z
                    .enum(['eq', 'gt', 'lt', 'gte', 'lte', 'ne'])
                    .transform((operator) => `$${operator}`),
                  z.string().transform((value) => parseFloat(value))
                )
                .safeParse(quantity)

              if (success) return operator

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const errors = error?.format() as any
              delete errors._errors

              for (const key in errors) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: JSON.stringify(errors[key]._errors),
                  path: [key],
                })
              }

              return operator
            }

            const quantityNumber = parseInt(quantity)
            if (isNaN(quantityNumber)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Quantity must be a number.',
                path: ['quantity'],
              })
            }

            return quantityNumber
          })
          .optional(),
        _id: z.string().optional(),
        category: z.enum(foodCategory).optional(),
        authorEmail: z.string().email().optional(),
      })
      .optional(),
  })
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const queryParser = (query: Record<string, any>) => {
  const parsed = dbQuerySchema.safeParse(query)
  parsed.data = JSON.parse(JSON.stringify(parsed.data))
  return parsed
}

export type ParsedQuery = z.infer<typeof dbQuerySchema>

export default addFoodDto
