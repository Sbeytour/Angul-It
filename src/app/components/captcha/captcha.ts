import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { CaptchaService } from '../../core/services/captchaService';
import { OperationCaptcha } from '../captcha-stages/operation-captcha/operation-captcha';
import { TextCaptcha } from '../captcha-stages/text-captcha/text-captcha';
import { ImageCaptcha } from '../captcha-stages/image-captcha/image-captcha';

@Component({
  selector: 'app-captcha',
  imports: [
    OperationCaptcha,
    TextCaptcha,
    ImageCaptcha,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss',
})
export class Captcha {
  private router = inject(Router);
  captchaService = inject(CaptchaService);

  currentStage = this.captchaService.currentStage;
  isCompleted = this.captchaService.isCompleted;
  isFirstStage = this.captchaService.isFirstStage;
  isLastStage = this.captchaService.isLastStage;
  currentStageAnswered = this.captchaService.currentStageAnswered;
  currentStageCorrect = computed(() => this.currentStage().isCorrect);

  progressPercent = computed(() =>
    ((this.captchaService.currentStageId() + 1) / this.captchaService.totalStages()) * 100
  );

  stageLabel = computed(() =>
    `Stage ${this.captchaService.currentStageId() + 1} of ${this.captchaService.totalStages()}`
  );

  nextChallenge(): void {
    if (this.isLastStage()) {
      this.captchaService.completeChallenge();
      this.router.navigate(['/result']);
    } else {
      this.captchaService.nextStage();
    }
  }

  previousChallenge(): void {
    this.captchaService.previousStage();
  }
}
