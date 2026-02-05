import { Component, inject } from '@angular/core';
import { CaptchaService } from '../../core/services/captchaService';

@Component({
  selector: 'app-captcha',
  imports: [],
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss',
})
export class Captcha {
  captchaService = inject(CaptchaService)
}
