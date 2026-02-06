import { Component, inject } from '@angular/core';
import { CaptchaService } from '../../core/services/captchaService';
import { OperationCaptcha } from '../captcha-stages/operation-captcha/operation-captcha';
import { TextCaptcha } from '../captcha-stages/text-captcha/text-captcha';
import { ImageCaptcha } from '../captcha-stages/image-captcha/image-captcha';

@Component({
  selector: 'app-captcha',
  imports: [
    OperationCaptcha,
    TextCaptcha,
    ImageCaptcha
  ],
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss',
})
export class Captcha {
  captchaService = inject(CaptchaService);
  
  currentStage = this.captchaService.currentStage;
  isCompleted = this.captchaService.isCompleted;

}
