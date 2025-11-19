import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return cookieName ? req.cookies?.[cookieName] : req.cookies;
  },
);
