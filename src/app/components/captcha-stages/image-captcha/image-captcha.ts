import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CaptchaStage } from '../../../core/models/captcha';
import { CaptchaService } from '../../../core/services/captchaService';

interface ImageItem {
  id: number;
  imageUrl: string;
  isCat: boolean;
}

@Component({
  selector: 'app-image-captcha',
  imports: [],
  templateUrl: './image-captcha.html',
  styleUrl: './image-captcha.scss',
})
export class ImageCaptcha {
  stage = input.required<CaptchaStage>();
  private captchaService = inject(CaptchaService);

  selectedIds = signal<Set<number>>(new Set());

  images = computed<ImageItem[]>(() => this.stage().puzzle as ImageItem[]);

  constructor() {
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
    this.selectedIds.update(current => {
      const next = new Set(current);
      if (next.has(imageId)) {
        next.delete(imageId);
      } else {
        next.add(imageId);
      }
      return next;
    });
    this.captchaService.submitAnswer(
      this.stage().id,
      Array.from(this.selectedIds())
    );
  }

  isSelected(imageId: number): boolean {
    return this.selectedIds().has(imageId);
  }
}
