import {
  Directive,
  Injector,
  Input,
  OnInit,
  Signal,
  effect,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { UserErrors } from '../user-data.service';

@Directive({
  selector: 'form[errors]',
  standalone: true,
})
/**
 * helper directive to hook up an signal with errors to the angular form.
 * once signals are properly supported, this kind of hacks can be removed.
 */
export class SignalErrorHookupDirective  {
  form = inject(NgForm);
  @Input({ required: true }) errors!: Signal<UserErrors | null>;

  constructor() {
    effect(() => {
      // read the errors signal, cast to any to work around TS typing issue
      // not worth fixing because this is a temporary workaround anyway
      const errors = this.errors() as any;
      const fg = this.form.form as FormGroup;
      Object.entries(fg.controls).forEach(([name, ctrl]) => {
        const error = errors && errors[name];
        // set/clear the error from the signal into the formControl that runs ngModal, so the UI will get updated.
        if (error) {
          ctrl.setErrors({ name: error });
        } else {
          ctrl.setErrors(null);
        }
      });
    });
  }
}
