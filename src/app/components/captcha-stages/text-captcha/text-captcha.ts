import { Component, input } from '@angular/core';
import { CaptchaStage } from '../../../core/models/captcha';

@Component({
  selector: 'app-text-captcha',
  imports: [],
  templateUrl: './text-captcha.html',
  styleUrl: './text-captcha.scss',
})
export class TextCaptcha {
  stage = input.required<CaptchaStage>();
}
