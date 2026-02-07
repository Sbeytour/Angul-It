import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CaptchaService } from '../services/captchaService';

export const captchaGuard: CanActivateFn = () => {
  const captchaService = inject(CaptchaService);
  const router = inject(Router);

  if (captchaService.isCompleted()) {
    return router.navigate(['/result']);;
  }

  return true;
};
