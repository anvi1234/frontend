
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { CartService } from 'src/app/shared/cart.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
   @Output() close = new EventEmitter<void>();

  showAuthPopup = true;
  activeTab: 'login' | 'register' = 'register';
  loginOtpSent = false;
  public registerOtpSent = false;
 loginForm!: FormGroup;
  registerForm!: FormGroup;
  otpSent = false;
  public message = '';
  public successmessage = '';
  public loginViaOTP: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cartSer: CartService
  ) {}

  ngOnInit(): void {
     this.authService.popupState$.subscribe((res)=>{
         this.showAuthPopup = res
     })
     this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:  [''],
       otp: ['']
    });
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required,Validators.minLength(4)],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]],
      otp: ['']
    });

    this.updateValidators();
  }

  updateValidators() {
    if (this.loginViaOTP) {
      this.loginForm.get('password')?.clearValidators();
      this.loginForm.get('otp')?.setValidators([Validators.required, Validators.minLength(4)]);
    } else {
      this.loginForm.get('otp')?.clearValidators();
      this.loginForm.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
    }

    this.loginForm.get('password')?.updateValueAndValidity();
    this.loginForm.get('otp')?.updateValueAndValidity();
  }

  get f() {
    return this.registerForm.controls;
  }

submitRegistration() {
  this.registerForm.markAllAsTouched();

  if (this.registerForm.invalid) return;

  const payload = { ...this.registerForm.value };
  delete payload.otp;

  this.authService.register(payload).subscribe({
    next: (res: any) => {
   this.showSuccess(res.message)
      this.registerOtpSent = true;

      this.registerForm.get('otp')?.setValidators([Validators.required]);
      this.registerForm.get('otp')?.updateValueAndValidity();
    },
    error: err => {
      this.message = err.error.message;
    }
  });
}

  //  this.authService.setSession(res);
  //       this.closePopup()

  closePopup() {
    this.showAuthPopup = false;
      this.authService.close();
    this.registerForm.reset();
    this.otpSent = false;
    this.close.emit();
  }
    switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.resetOtpState();
  }

   resetOtpState() {
    this.loginOtpSent = false;
    this.registerOtpSent = false;
    this.loginForm.reset();
    this.registerForm.reset();
  }
   sendLoginOtp() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.get('email')?.invalid) return;
       const payload = { ...this.loginForm.value };
      delete payload.password;
        delete payload.otp;
    this.authService.sendLoginOtp(payload.email).subscribe((res:any) => {
      this.loginOtpSent = true;
        this.showSuccess(res.message)
      this.loginForm.get('otp')?.setValidators([Validators.required]);
      this.loginForm.get('otp')?.updateValueAndValidity();
    });
  }

 verifyRegisterOtp() {
  this.registerForm.markAllAsTouched();
  if (!this.registerForm.value.otp) return;

  const payload = {
    email: this.registerForm.value.email,
    otp: this.registerForm.value.otp
  };

  this.authService.verifyEmailOtp(payload).subscribe({
    next: (res: any) => {
      this.showSuccess(res.message)
      // Reset register form
      this.registerForm.reset();
      this.registerOtpSent = false;

      // Switch to login
      setTimeout(() => {
        this.switchTab('login');
        this.message = '';
      }, 1500);
    },
    error: err => {
      this.showError(err.error.message)
    }
  });
}

   submitLogin() {
    if (this.loginForm.invalid) return;
    if(this.loginViaOTP){
       const payload = { ...this.loginForm.value };
      delete payload.password;
    this.authService.verifyLoginOtp(payload)
  .subscribe({
    next: (res: any) => {
      // SUCCESS (200)
      this.authService.setSession(res);
      this.getCartDetails()
      this.closePopup();
    },
    error: (err) => {
     const msg = err?.error?.message || 'Something went wrong';
      this.showError(msg)
    }
  });
    }
    else{
       const payload = { ...this.loginForm.value };
      delete payload.otp;
      this.authService.loginPassword(payload)
  .subscribe({
    next: (res: any) => {
      this.authService.setSession(res);
      this.getCartDetails()
      this.closePopup();
      this.router.navigateByUrl("/")
    },
    error: (err) => {
     const msg = err?.error?.message || 'Something went wrong';
      this.showError(msg)
    }
  });
    }

   }

   public getCartDetails(){
    this.cartSer.getCart().subscribe((res)=>{
      if(res){
        this.cartSer.setCartCount(res.items.length)
      }

    })
   }

changeLoginMethod(event:Event){
   const isChecked = (event.target as HTMLInputElement).checked;
  this.loginViaOTP = isChecked;
  if(this.loginViaOTP){
    this.sendLoginOtp();
  }
  
}

showError(msg: string) {
  this.message = msg;
  this.successmessage = ''; // override success
}

showSuccess(msg: string) {
  this.successmessage = msg;
  this.message = ''; // override error
}

}
