import { Component, signal, inject } from '@angular/core';
import { Address } from '../../../models/address';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { firstValueFrom } from 'rxjs'; 

@Component({
  selector: 'app-customer-login-page',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  templateUrl: './customer-login-page.component.html',
  styleUrl: './customer-login-page.component.css',
})
export class CustomerLoginPageComponent {
  hide = signal(true);
  emailErrorMessage = signal('');
  phoneErrorMessage = signal('');

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  gender: string = "M";

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);
  readonly firstName = new FormControl('', [Validators.required]);
  readonly lastName = new FormControl('', [Validators.required]);
  readonly birthDate = new FormControl('', [Validators.required]);
  readonly street = new FormControl('', [Validators.required]);
  readonly zipCode = new FormControl('', [Validators.required]);
  readonly city = new FormControl('', [Validators.required]);
  readonly phone = new FormControl('', [Validators.required, Validators.maxLength(10)]);
  readonly confPassword = new FormControl('', [Validators.required]);

  constructor(private router: Router, private _httpClient: HttpClient){}

  private _snackBar = inject(MatSnackBar);

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.emailErrorMessage.set('Vous ne pouvez pas laisser ce champ vide');
    } else if (this.email.hasError('email')) {
      this.emailErrorMessage.set('L\'email n\'est pas valide');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePhoneErrorMessage() {
    if (this.phone.hasError('required')) {
      this.phoneErrorMessage.set('Vous ne pouvez pas laisser ce champ vide');
    } else if (this.phone.hasError('maxlength')) {
      this.phoneErrorMessage.set('Le numéro est trop long (max 10 caractères)');
    } else {
      this.phoneErrorMessage.set('');
    }
  }

  async loginClick() {
    try {
      let user = {
        email: this.email.value,
        password: this.password.value,
      };

      localStorage.setItem('userData', JSON.stringify(user));
      let resp = JSON.stringify(await firstValueFrom(this._httpClient.get('/api/auth')));
      resp = resp.substring(9);
      const n = resp.length;
      resp = resp.substring(0, n-2);

      localStorage.setItem('userName', resp);

      this.router.navigate(["customer/index"]);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === HttpStatusCode.Unauthorized) {
          this._snackBar.open(
            'Les informations fournies n\'ont pas permis de vous identifier.', '',
            { duration: 3000 }
          );
        }
      }
    }
  }

  async signupClick() {
    try {
      if (!this.firstName.value || !this.lastName.value || !this.email.value 
        || !this.phone.value || !this.birthDate.value
        || !this.street.value || !this.zipCode.value || !this.city.value
        || !this.password.value || !this.confPassword.value) {
        this._snackBar.open(
          'Il manque des données vous concernant', undefined,
          { duration: 3000 }
        );
      }
      else if (this.password.value != this.confPassword.value) {
        this._snackBar.open(
          'Les mots de passe ne correspondent pas', undefined,
          { duration: 3000 }
        );
      }
      else {
        let user = {
          email: this.email.value!,
          password: this.password.value!,
        };

        let toAddaddress: {
          street: string;
          zipCode: string;
          city: string;
        };
        
        toAddaddress = {
          street: this.street.value!,
          zipCode: this.zipCode.value!,
          city: this.city.value!,
        };

        localStorage.setItem('userData', JSON.stringify(user));
        
        let resp = JSON.stringify(await firstValueFrom(this._httpClient.post('/api/address/create', toAddaddress)));
        resp = resp.substring(6);
        const n = resp.length;
        resp = resp.substring(0, n-1);

        let address: Address = {
          id: parseInt(resp),
          street: toAddaddress.street,
          city: toAddaddress.city,
          zipCode: toAddaddress.zipCode
        };

        let patient = {
          firstName: this.firstName.value!, 
          lastName: this.lastName.value!, 
          gender: this.gender == "M", 
          email: this.email.value!, 
          phone: this.phone.value!,
          birthDate: new Date(this.birthDate.value ? this.birthDate.value : "01/01/1970"), 
          address: address,
          password: this.password.value!
        };

        localStorage.setItem('user', JSON.stringify(patient));
        localStorage.setItem('userName', this.firstName.value!);
        await firstValueFrom(this._httpClient.post('/api/patients/create', patient))
  
        this.router.navigate(["customer/index"]);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === HttpStatusCode.Unauthorized) {
          this._snackBar.open(
            'Les informations fournies n\'ont pas permis de vous identifier.', undefined,
            { duration: 3000 }
          );
        }
      }
    }
  }
}
