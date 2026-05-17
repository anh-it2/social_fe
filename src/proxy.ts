import createMiddleware from 'next-intl/middleware';
import {hasLocale} from 'next-intl';
import {NextResponse, type NextRequest} from 'next/server';
import {routing} from './i18n/routing';
import {AUTH_COOKIE} from './feature/auth/server/authProxy';

const handleI18nRouting = createMiddleware(routing);

// Pages reachable without the auth cookie. Everything else under `[locale]`
// lives in the (protected) route group and requires a session.
const PUBLIC_PAGES = ['/login', '/register'];

export default function proxy(req: NextRequest): NextResponse {
  const {pathname} = req.nextUrl;

  // Strip the `/[locale]` prefix so route checks are locale-agnostic.
  const segments = pathname.split('/');
  const hasLocalePrefix = hasLocale(routing.locales, segments[1]);
  const locale = hasLocalePrefix ? segments[1] : routing.defaultLocale;
  const path = hasLocalePrefix
    ? '/' + segments.slice(2).join('/')
    : pathname;

  const isPublic = PUBLIC_PAGES.some(
    (p) => path === p || path.startsWith(p + '/'),
  );
  // httpOnly cookie set by forwardAuth; "" after logout → treated as no session.
  const isAuthed = Boolean(req.cookies.get(AUTH_COOKIE)?.value);

  if (!isAuthed && !isPublic) {
    const url = new URL(`/${locale}/login`, req.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthed && isPublic) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return handleI18nRouting(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
