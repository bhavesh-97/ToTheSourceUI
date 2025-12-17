import { Component, AfterViewInit, inject, ElementRef,ViewChild, QueryList, ViewChildren,Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { gsap } from 'gsap';
import { SharedImports } from '../../shared/imports/shared-imports';
import { FormUtils } from '../../shared/utilities/form-utils.ts.js';
import { FormFieldConfig } from '../../Interfaces/FormFieldConfig.js';
import { ValidationRules } from '../../shared/utilities/validation-rules.enum.js';
import { NotificationService } from '../../services/notification.service.js';
import { MUser } from '../../models/MUser.js';
import { LoginService } from './login.service.js';
import { PopupMessageType } from '../../models/PopupMessageType.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...SharedImports, TooltipModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit {
  @ViewChild('tiltContainer', { static: false }) tiltContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('inputField') inputElements!: QueryList<ElementRef>;
  public notificationService = inject(NotificationService);

  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private FormUtils = inject(FormUtils);
  private loginService = inject(LoginService);
  private router = inject(Router);
  
  loginForm: FormGroup;
  emailShowError = false;
  passwordShowError = false;
  showPassword = false; 
  showEmail = false;


  // Form field configurations
  private formFields: FormFieldConfig[] = [
    { name: 'EmailID', isMandatory: false, validationMessage: 'Please enter a valid email address.', events: [{ type: 'focusout', validationRule: ValidationRules.EmailID }] },
    { name: 'UserName', isMandatory: false,validationMessage: 'Please enter a valid User Name.', events: [{ type: 'keypress', validationRule: ValidationRules.AlphanumericWithSpecialCharacters }] },
    { name: 'Password', isMandatory: true, validationMessage: 'Please enter a valid Password', events: [] },
  ];

  // get EmailID() { return this.loginForm.get('EmailID'); }
  // get UserName() { return this.loginForm.get('UserName'); }
  // get Password() { return this.loginForm.get('Password'); }

  constructor() {
    this.loginForm = this.FormUtils.createFormGroup(this.formFields, this.fb);
  }
   toggleEmailUserName(): void {
    this.showEmail = !this.showEmail;
    this.emailShowError = false;
    this.toggleFieldValidation();
   }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  } 
 toggleFieldValidation() {
  const activeFieldName = this.showEmail ? 'EmailID' : 'UserName';
  const inactiveFieldName = this.showEmail ? 'UserName' : 'EmailID';

  const activeControl = this.loginForm.get(activeFieldName);
  const inactiveControl = this.loginForm.get(inactiveFieldName);

  const activeField = this.formFields.find(f => f.name === activeFieldName);
  const inactiveField = this.formFields.find(f => f.name === inactiveFieldName);

  const activeElement = this.inputElements.find(
    el => el.nativeElement.getAttribute('formControlName') === activeFieldName
  )?.nativeElement as HTMLInputElement | undefined;

  const inactiveElement = this.inputElements.find(
    el => el.nativeElement.getAttribute('formControlName') === inactiveFieldName
  )?.nativeElement as HTMLInputElement | undefined;

  // Make the active field mandatory
  if (activeField && activeControl && activeElement) {
    this.FormUtils.updateValidationRule(activeElement, activeField, true, this.renderer, activeControl);
    activeControl.markAsTouched();
    activeControl.markAsDirty();
    activeControl.updateValueAndValidity();
  }

  // Make the inactive field always valid
  if (inactiveField && inactiveControl && inactiveElement) {
    this.FormUtils.updateValidationRule(inactiveElement, inactiveField, false, this.renderer, inactiveControl);
    inactiveControl.setErrors(null);              
    inactiveControl.markAsPristine();
    inactiveControl.markAsUntouched();
    inactiveControl.updateValueAndValidity({ emitEvent: false });
  }
}

  ngAfterViewInit() {
      this.FormUtils.registerFormFieldEventListeners(this.formFields, this.inputElements.toArray(), this.renderer,this.loginForm);
      this.toggleFieldValidation();

      const inputs = document.querySelectorAll('.p-inputtext');
      inputs.forEach((input) => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                    duration: 0.5,
                    ease: 'power2.inOut', 
                    boxShadow: '0 0 5px #57b846', opacity: 1
                  });
            const symbol = input.parentElement?.querySelector('.symbol-input100 i');
            if (symbol) {
                  gsap.to(symbol, { duration: 0.4, color: '#57b846' });
              }
          });
            input.addEventListener('blur', () => {
              gsap.to(input, { duration: 0.3, boxShadow: 'none', opacity: 1 });
              const symbol = input.parentElement?.querySelector('.symbol-input100 i');
              if (symbol) {
                    gsap.to(symbol, { duration: 0.4, color: '#666666' }); 
             }
        });
        });

    // GSAP for form title entrance animation
    gsap.from('.login100-form-title', { duration: 1, y: 50, opacity: 0, ease: 'power2.out' });

    // GSAP for button hover
    const button = document.querySelector('.login100-form-btn');
    if (button) {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, { duration: 0.4, backgroundColor: '#333333' });
      });
      button.addEventListener('mouseleave', () => {
        gsap.to(button, { duration: 0.4, backgroundColor: '#57b846' });
      });
    }

    // GSAP tilt animation for the image container (replacing js-tilt)
    if (this.tiltContainer) {
      const container = this.tiltContainer.nativeElement;
      const img = container.querySelector('img');

      container.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(img, {
          duration: 0.3,
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          ease: 'power2.out'
        });
      });

      container.addEventListener('mouseleave', () => {
        gsap.to(img, {
          duration: 0.5,
          rotationX: 0,
          rotationY: 0,
          ease: 'power2.out'
        });
      });

      // Initial entrance animation for image
      gsap.from(img, { duration: 1, scale: 0.8, opacity: 0, ease: 'back.out(1.7)' });
    }
  }
  onSubmit() {
    const outcome = this.FormUtils.validateFormFields(this.formFields, this.loginForm, this.inputElements.toArray(), this.renderer);
    if (outcome.isError) {
      this.notificationService.showMessage(outcome.strMessage, outcome.title, outcome.type);
      return;
    }  
    const inactiveField = this.showEmail ? 'userName' : 'emailID';
    const loginModel = this.FormUtils.getAllFormFieldData(this.formFields, this.loginForm, this.inputElements.toArray(), MUser);
    
    if (loginModel && Object.prototype.hasOwnProperty.call(loginModel, inactiveField)) {
      loginModel[inactiveField] = '';
    }
    this.loginService.GetUserLogin(loginModel).subscribe({
      next: (res) => {
        if (!res.isError) {
          debugger;
          // var response = JSON.parse(res.result);
          const response = res.result;
          this.loginForm.reset();
          this.loginService.storeToken(res.token ?? '');
          this.loginService.storeUserInfo(response.user ?? new MUser());
          this.loginService.storeMenuList(response.menu ?? []);
          this.notificationService.showMessage(res.strMessage, res.title, res.type);
   //       this.router.navigate(['/CMS/dashboard']);
           this.router.navigate(['/CMS/main']);
   
        } else {
          this.notificationService.showMessage(res.strMessage, res.title, res.type);
        }
      },
      error: (err) => {
        this.notificationService.showMessage(
          'Something went wrong while connecting to the server.',
          'Error',
          PopupMessageType.Error
        );
      }
    });
  }
}
