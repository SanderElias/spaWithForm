import {
  Component,
  ElementRef,
  Input,
  Signal,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `<dialog><ng-content /></dialog>`,
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  @Input({ required: true }) shown!: Signal<unknown>;
  elm = inject(ElementRef).nativeElement;

  constructor() {
    let first=true; // when used in SSR, it can't close because dialog isn't implemented just yet.
    effect(() => {
      const shown = !!this.shown(); // cast to boolean
      const dlg = this.elm.firstChild as HTMLDialogElement;
      if (shown) {
        dlg?.showModal?.();
      } else {
        !first && dlg.close?.();
      }
      first=false;
    });
  }
}
