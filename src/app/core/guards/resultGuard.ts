import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CaptchaService } from '../services/captchaService';

export const resultGuard: CanActivateFn = () => {
  const captchaService = inject(CaptchaService);
  const router = inject(Router);

  if (captchaService.isCompleted()) {
    return true;
  }

  return router.navigate(['/challenges']);
};
