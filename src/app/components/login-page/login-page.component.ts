import { Component, signal, inject, PLATFORM_ID, Inject } from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login-page',
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
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
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

  constructor(
    private router: Router, 
    private _httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  private _snackBar = inject(MatSnackBar);

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }

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
        role: "USER"
      };

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('userData', JSON.stringify(user));
      }
      
      let resp = JSON.stringify(await firstValueFrom(this._httpClient.get('/api/auth')));
      resp = resp.substring(9);
      const n = resp.length;
      resp = resp.substring(0, n-2);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('userName', resp);
      }

      this.router.navigate(["customer/index"]);
    } catch (error) {
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
        let addressToCreate = {
          street: this.street.value!,
          zipCode: this.zipCode.value!,
          city: this.city.value!
        };
        
        const addressResponse = await firstValueFrom(
          this._httpClient.post<{id: number}>('/api/address/create', addressToCreate)
        );

        let patientToCreate = {
          firstName: this.firstName.value!, 
          lastName: this.lastName.value!, 
          gender: this.gender == "M", 
          email: this.email.value!, 
          phone: this.phone.value!,
          birthDate: new Date(this.birthDate.value ? this.birthDate.value : "01/01/1970"), 
          address: {
            id: addressResponse.id
          },
          password: this.password.value!,
          vaccines: []
        };

        console.log('Patient à créer:', patientToCreate);

        await firstValueFrom(this._httpClient.post('/api/patients/create', patientToCreate, {
          headers: {
            'Content-Type': 'application/json'
          }
        }));
        
        this.router.navigate(["/customer/index"]);
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (error instanceof HttpErrorResponse) {
        let message = 'Une erreur est survenue lors de l\'inscription.';
        if (error.status === HttpStatusCode.Unauthorized) {
          message = 'Les informations fournies n\'ont pas permis de vous identifier.';
        } else if (error.status === HttpStatusCode.Conflict) {
          message = 'Un compte existe déjà avec cet email.';
        } else if (error.status === HttpStatusCode.InternalServerError) {
          message = 'Erreur serveur: ' + (error.error?.message || 'Erreur inconnue');
        }
        this._snackBar.open(message, undefined, { duration: 3000 });
      }
    }
  }
}