import { Component, OnInit, ViewChild, effect, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ShowErrorComponent } from './show-error/show-error.component';
import { UserDataService } from '../user-data.service';
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
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export default class SignUpComponent implements OnInit {
  uds = inject(UserDataService);
  user = this.uds.userData;
  $errors = this.uds.$validationErrors;
  save = this.uds.save
  @ViewChild('form', { read: NgForm }) form!: NgForm;

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
