import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

export const userRouter = router({
  getById: publicProcedure.input(z.object({ uid: z.string() })).query(async () => {
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  }),
});

export const workoutRouter = router({
  list: publicProcedure.input(z.object({ userId: z.string() })).query(async () => {
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  }),
  create: publicProcedure.input(z.any()).mutation(async () => {
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  }),
  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async () => {
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  }),
});

export const moodRouter = router({
  getToday: publicProcedure.input(z.object({ userId: z.string() })).query(async () => {
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  }),
  setMood: publicProcedure.input(z.any()).mutation(async () => {
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  }),
});

export const motivationRouter = router({
  random: publicProcedure.query(async () => {
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  }),
});

export const appRouter = router({
  user: userRouter,
  workout: workoutRouter,
  mood: moodRouter,
  motivation: motivationRouter,
});

export type AppRouter = typeof appRouter;

