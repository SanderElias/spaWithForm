import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, filter, firstValueFrom, map, of, switchMap } from 'rxjs';
import { validateUser } from './validateUser';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  #http = inject(HttpClient);
  /** lastName as a signal so I can reuse it for the thumbnail */
  #lastName = signal('');
  /** use Angular rxInterop to create a signal that fetches a new thumbnail, as soon as it changes */
  #thumbnailUrl = toSignal(
    toObservable(this.#lastName).pipe(
      filter((ln) => ln.trim().length > 0),
      switchMap((ln) =>
        this.#http.get<TypicodePhotoResult>(
          `https://jsonplaceholder.typicode.com/photos/${ln.length}`
        )
      ),
      map((result) => result.thumbnailUrl),
      catchError(() => of('')) // silently ignore any error, don't do this in a production app, unless its harmless to do.
    ),
    { initialValue: '' } // start off with an empty string, so that there is always a value in the signal.
  );
  /** use signals to create a responsive base model, where we can update all fields in isolation */
  userData: $UserData = {
    firstName: signal(''),
    lastName: this.#lastName,
    email: signal(''),
    password: signal(''),
    thumbnailUrl: this.#thumbnailUrl,
  };

  /**
   * for places where it is easier to have the complete object
   */
  $user: Signal<UserData> = computed(() => {
    return {
      firstName: this.userData.firstName(),
      lastName: this.userData.lastName(),
      email: this.userData.email(),
      password: this.userData.password(),
      thumbnailUrl: this.userData.thumbnailUrl(),
    };
  });

  /** note there are better ways to do validation. a third party like vest allows to reuse validations on the server for example */
  $validationErrors = computed(() => {
    const data = this.$user();
    return validateUser(data);
  });

  /** use an arrow function, so it is hard bound to this class, makes reuse in components easier */
  save = async () => {
    const data = this.$user();
    try {
      const result = await firstValueFrom(
        this.#http.post<TypiCodePostResult>(
          `https://jsonplaceholder.typicode.com/users`,
          data
        )
      );
      console.log('posted to typiCode', result);
      return result;
    } catch (e) {
      console.warn('Error while posting data', e);
      return undefined;
    }
  };
}

/** normalize/simplify exported types */
type Normalize<T> = T extends unknown
  ? {
      [K in keyof T]: T[K];
    }
  : never;

/** create an object where every property is wrapped into a signal */
type Signaled<T> = Normalize<{
  [K in keyof T]: Signal<T[K]>;
}>;
/** create an objects where all properties are optional strings */
type Errored<T> = Normalize<{
  [k in keyof T]?: string;
}>;

/**
 * in an real application this probably should be in its own file,
 * so the bundler doesn't pull in the service when I only need the typings.
 */
export interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  thumbnailUrl: string;
}

export type $UserData = Signaled<UserData>;

/** fields with an error will have the exact error description in there */
export type UserErrors = Errored<UserData>;

export interface TypicodePhotoResult {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface TypiCodePostResult {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  thumbnailUrl: string;
  id: number;
}
