import { Component, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CaptchaStage } from '../../../core/models/captcha';
import { CaptchaService } from '../../../core/services/captchaService';

@Component({
  selector: 'app-text-captcha',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './text-captcha.html',
  styleUrl: './text-captcha.scss',
})
export class TextCaptcha {
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
    if (value.trim() !== '') {
      this.captchaService.submitAnswer(this.stage().id, value);
    }
  }
}
