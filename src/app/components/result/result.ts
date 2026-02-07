import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CaptchaService } from '../../core/services/captchaService';

@Component({
  selector: 'app-result',
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result {
  private router = inject(Router);
  private captchaService = inject(CaptchaService);

  stages = this.captchaService.stages;
  timeTaken = this.captchaService.getTimeTaken();

  totalCorrect = computed(() =>
    this.stages().filter(s => s.isCorrect).length
  );

  totalStages = this.captchaService.totalStages;

  allCorrect = computed(() =>
    this.totalCorrect() === this.totalStages()
  );

  restart(): void {
    this.captchaService.resetState();
    this.router.navigate(['/home']);
  }
}
