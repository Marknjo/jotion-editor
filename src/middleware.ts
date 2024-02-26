import { authMiddleware } from '@clerk/nextjs';
import { env } from 'process';

export default authMiddleware({
  publicRoutes: (req) => {
    const { url } = req;

    if (req.url.includes('preview') || url === env.APP_URL) return true;

    return false;
  },
  ignoredRoutes: [
    '/((?!api|trpc|edgestore))(_next.*|.+.[w]+$)',
    '/api/edgestore/init',
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc|edgestore)(.*)'],
};
