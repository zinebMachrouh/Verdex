import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  private readonly router = inject(Router);
  picture: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
      ]],
      password_confirmation: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,.'-]{3,}$/)]],
      birthday: ['', [Validators.required, this.minAgeValidator(18)]],
      picture: [null, this.pictureValidator]
    }, {
      validators: this.passwordsMatch
    });
  }

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get password_confirmation() { return this.registerForm.get('password_confirmation'); }
  get name() { return this.registerForm.get('name'); }
  get phone() { return this.registerForm.get('phone'); }
  get address() { return this.registerForm.get('address'); }
  get birthday() { return this.registerForm.get('birthday'); }

  private passwordsMatch(group: FormGroup) {
    return group.get('password')?.value === group.get('password_confirmation')?.value
      ? null : { passwordsMismatch: true };
  }

  private minAgeValidator(minAge: number) {
    return (control: AbstractControl) => {
      const birthDate = new Date(control.value);
      if (isNaN(birthDate.getTime())) return { invalidDate: true };

      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const hasBirthdayPassedThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

      if (age > minAge || (age === minAge && hasBirthdayPassedThisYear)) {
        return null;
      }
      return { underage: true };
    };
  }

  private pictureValidator(control: AbstractControl) {
    const file = control.value;
    if (file && file instanceof File) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return { invalidFileType: true };
      }
      if (file.size > 15 * 1024 * 1024) {
        return { fileTooLarge: true };
      }
    }
    return null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.picture = input.files[0];
      console.log('Selected file:', this.picture);
    }
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.invalid) {
      alert('Please correct the errors in the form.');
      return;
    }

    const { email, password, name, phone, address, birthday } = this.registerForm.value;
    const role = 'user';

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('name', name.trim());
    formData.append('phone', phone.trim());
    formData.append('address', address.trim());
    formData.append('birthday', new Date(birthday).toISOString());
    formData.append('role', role);

    try {
      // @ts-ignore
      const result = await this.authService.register(formData, this.picture);
      if (result) {
        this.router.navigate(['/login']);
        console.log('Registration successful.');
      } else {
        console.log('Registration failed.');
      }
    } catch (error) {
      alert('An error occurred during registration.');
    }
  }
}
