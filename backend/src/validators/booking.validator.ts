import { z } from 'zod';

const platformOptions = {
  chat: ['In-App Chat', 'WhatsApp', 'Telegram', 'Signal'],
  video: ['Google Meet', 'Zoom', 'Microsoft Teams'],
};

export const createBookingSchema = z.object({
  body: z.object({
    companionId: z.string().min(1, 'Companion ID is required'),
    type: z.enum(['chat', 'video'], {
      errorMap: () => ({ message: 'Type must be either "chat" or "video"' }),
    }),
    platform: z.string().min(1, 'Platform is required'),
    startDateTime: z.string().datetime('Invalid ISO datetime format'),
  }).refine(
    (data) => {
      const validPlatforms = platformOptions[data.type];
      return validPlatforms.includes(data.platform);
    },
    {
      message: 'Invalid platform for the selected type',
      path: ['platform'],
    }
  ),
});

