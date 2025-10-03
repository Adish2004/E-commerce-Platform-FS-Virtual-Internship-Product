import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Fake Router
class RouterStub {
  navigate(commands: any[]) {}
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: RouterStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [SignupComponent],
      providers: [
        { provide: Router, useClass: RouterStub }
      ]
    });

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as unknown as RouterStub;
    fixture.detectChanges(); // triggers ngOnInit
  });

  // ✅ Test 1: Component creation
  fit('Frontend_SignupComponent_should_create_SignupComponent', () => {
    expect(component).toBeTruthy();
  });

  // ✅ Test 2: Form should initialize with empty values
  fit('Frontend_SignupComponent_should_initialize_signup_form_with_empty_fields', () => {
    const form = component.signupForm;
    expect(form).toBeDefined();
    expect(form.controls['username'].value).toBe('');
    expect(form.controls['email'].value).toBe('');
    expect(form.controls['password'].value).toBe('');
    expect(form.controls['confirmPassword'].value).toBe('');
  });

  // ✅ Test 3: Password mismatch validation
  fit('Frontend_SignupComponent_should_mark_form_as_invalid_if_passwords_do_not_match', () => {
    component.signupForm.controls['password'].setValue('123456');
    component.signupForm.controls['confirmPassword'].setValue('654321');
    const errors = component.signupForm.errors || {};
    expect(errors['mismatch']).toBeTrue();
  });

  // ✅ Test 4: Invalid email should trigger email validator error
  fit('Frontend_SignupComponent_should_mark_form_invalid_for_incorrect_email', () => {
    component.signupForm.controls['email'].setValue('invalid-email');
    const errors = component.signupForm.controls['email'].errors || {};
    expect(errors['invalidEmail']).toBeTrue();
  });

  // ✅ Test 5: onSubmit should not submit if form is invalid
  fit('Frontend_SignupComponent_should_not_submit_if_form_is_invalid', () => {
    spyOn(window, 'alert'); // prevent actual alert
    component.onSubmit();
    expect(component.submitted).toBeTrue();
    expect(component.signupForm.invalid).toBeTrue();
  });
});
