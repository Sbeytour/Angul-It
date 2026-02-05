import { Component, inject } from '@angular/core';
import { MatButton, MatFabButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    MatFabButton
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  router = inject(Router)

  startChallenge() {
    this.router.navigate(['/challenges'])
  }
}
