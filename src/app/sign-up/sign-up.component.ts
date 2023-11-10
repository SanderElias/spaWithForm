import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogComponent } from '../../util/dialog/dialog.component';
import { SpinnerComponent } from '../../util/spinner/spinner.component';
import { UserDataService } from '../user-data.service';
import { ShowErrorComponent } from './show-error/show-error.component';
import { SignalErrorHookupDirective } from './signal-error-hookup.directive';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ShowErrorComponent,
    JsonPipe,
    SignalErrorHookupDirective,
    SpinnerComponent,
    DialogComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export default class SignUpComponent implements OnInit {
  uds = inject(UserDataService);
  user = this.uds.userData;
  $errors = this.uds.$validationErrors;
  $saving = signal(false);
  $result = signal<string | undefined>(undefined);
  @ViewChild('form', { read: NgForm }) form!: NgForm;

  save = async () => {
    this.$saving.set(true);
    const { id } = (await this.uds.save()) || {};
    if (!id) {
      // save failed, we should inform the user
      this.$result.set('Could not save to backend, contact support!');
    } else {
      this.$result.set(`Your form is saved under id:"${id}"`);
    }
    // add some additional time, to mimic a slow backend.
    await new Promise((r) => setTimeout(r, 1000));
    this.$saving.set(false);
  };
  ngOnInit(): void {
    // this ugly hack will not be needed anymore once signals have proper support in forms.
    setTimeout(() => uglyFormHack(this.form, this.user));
  }
}

/**
 * Ugly hack, hidden under the fold... :-D
 */
const uglyFormHack = (form: NgForm, user: any) => {
  const formGroup = form.form;
  formGroup.valueChanges.subscribe((x) => {
    Object.entries(x).forEach(([fieldName, value]) => {
      const ref = `${fieldName}`;
      if (value !== user[ref]()) {
        user[ref].set(value);
      }
    });
  });
};
