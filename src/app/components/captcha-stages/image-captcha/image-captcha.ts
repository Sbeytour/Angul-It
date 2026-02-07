import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { CaptchaStage, ImageItem } from '../../../core/models/captcha';
import { CaptchaService } from '../../../core/services/captchaService';

@Component({
  selector: 'app-image-captcha',
  imports: [],
  templateUrl: './image-captcha.html',
  styleUrl: './image-captcha.scss',
})
export class ImageCaptcha {
  stage = input.required<CaptchaStage>();
  disabled = input<boolean>(false);
  private captchaService = inject(CaptchaService);

  selectedIds = signal<Set<number>>(new Set());

  images = computed<ImageItem[]>(() => this.stage().puzzle as ImageItem[]);

  constructor() {
    // Restore previous answer when navigating back
    effect(() => {
      const s = this.stage();
      if (s.userAnswer !== null && Array.isArray(s.userAnswer)) {
        this.selectedIds.set(new Set(s.userAnswer));
      } else {
        this.selectedIds.set(new Set());
      }
    });
  }

  toggleImage(imageId: number): void {
    if (this.disabled()) return;

    this.selectedIds.update(current => {
      const next = new Set(current);
      if (next.has(imageId)) {
        next.delete(imageId);
      } else {
        next.add(imageId);
      }
      return next;
    });

    // Submit answer after updating selection (use untracked to prevent circular effect triggers)
    untracked(() => {
      const answer = this.selectedIds().size > 0 ? Array.from(this.selectedIds()) : null;
      if (answer !== null) {
        this.captchaService.submitAnswer(this.stage().id, answer);
      }
    });
  }

  isSelected(imageId: number): boolean {
    return this.selectedIds().has(imageId);
  }
}
