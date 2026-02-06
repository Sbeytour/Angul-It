import { Component, input } from '@angular/core';
import { CaptchaStage } from '../../../core/models/captcha';

@Component({
  selector: 'app-operation-captcha',
  imports: [],
  templateUrl: './operation-captcha.html',
  styleUrl: './operation-captcha.scss',
})
export class OperationCaptcha {
  stage = input.required<CaptchaStage>();
}
