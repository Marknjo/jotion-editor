import { auth } from '@clerk/nextjs';

import type { UserIdentity } from 'convex/server';
import { query } from '../../convex/_generated/server';

export const currentUser = query(async (ctx) => {
  const user = await ctx.auth.getUserIdentity();

  if (user === null) {
    return null;
  }

  return user;
});
