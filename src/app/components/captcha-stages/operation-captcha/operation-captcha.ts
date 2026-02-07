import { Component, effect, inject, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaptchaStage } from '../../../core/models/captcha';
import { CaptchaService } from '../../../core/services/captchaService';

@Component({
  selector: 'app-operation-captcha',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './operation-captcha.html',
  styleUrl: './operation-captcha.scss',
})
export class OperationCaptcha {
  stage = input.required<CaptchaStage>();
  private captchaService = inject(CaptchaService);

  answerControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  constructor() {
    effect(() => {
      const s = this.stage();
      const value = s.userAnswer !== null ? String(s.userAnswer) : '';
      this.answerControl.setValue(value);
    });
  }

  onAnswerChange(): void {
    const value = this.answerControl.value;
    if (value !== '') {
      this.captchaService.submitAnswer(this.stage().id, value);
    }
  }
}