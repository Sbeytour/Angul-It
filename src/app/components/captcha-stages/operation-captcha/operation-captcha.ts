import { Component, effect, inject, input, DestroyRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaptchaStage } from '../../../core/models/captcha';
import { CaptchaService } from '../../../core/services/captchaService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-operation-captcha',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './operation-captcha.html',
  styleUrl: './operation-captcha.scss',
})
export class OperationCaptcha {
  stage = input.required<CaptchaStage>();
  disabled = input<boolean>(false);
  private captchaService = inject(CaptchaService);

  answerControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  constructor() {
    // Restore previous answer when navigating back
    effect(() => {
      const s = this.stage();
      const value = s.userAnswer !== null ? String(s.userAnswer) : '';
      this.answerControl.setValue(value, { emitEvent: false });
    });

    // Handle disabled state
    effect(() => {
      if (this.disabled()) {
        this.answerControl.disable();
      } else {
        this.answerControl.enable();
      }
    });

    // Submit answer on value change (but don't validate yet)
    this.answerControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value !== '' && !this.disabled()) {
          this.captchaService.submitAnswer(this.stage().id, value);
        }
      });
  }
}