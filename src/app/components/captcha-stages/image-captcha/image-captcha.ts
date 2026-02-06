import { Component, input } from '@angular/core';
import { CaptchaStage } from '../../../core/models/captcha';

@Component({
  selector: 'app-image-captcha',
  imports: [],
  templateUrl: './image-captcha.html',
  styleUrl: './image-captcha.scss',
})
export class ImageCaptcha {
  stage = input.required<CaptchaStage>();
}
