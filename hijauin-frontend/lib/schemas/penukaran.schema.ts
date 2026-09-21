import { z } from 'zod';

/**
 * Point redemption validation schema.
 */
export const createPenukaranSchema = z.object({
  hadiah_id: z
    .number({ message: 'Hadiah wajib dipilih' })
    .int()
    .positive(),
});

export type CreatePenukaranInput = z.infer<typeof createPenukaranSchema>;
