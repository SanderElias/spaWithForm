import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserDataService } from './user-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  uds = inject(UserDataService)
  $fullName = computed(() => `${this.uds.userData.firstName().trim()} ${this.uds.userData.lastName()}`.trim())
  $avatarUrl = computed(() => {
    const url = this.uds.userData.thumbnailUrl()
    return url ? url : `https://via.placeholder.com/150/afafaf`
  })
}
