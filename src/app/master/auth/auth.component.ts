
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
  activeTab: 'login' | 'register' = 'login';
  loginOtpSent = false;
  loginMode = "otp"
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
  ) {
    
  }

  ngOnInit(): void {
   try {
      this.authService.popupState$.subscribe((res)=>{
         this.showAuthPopup = res;
         this.successmessage = "";
    this.message = ""
    this.loginForm.reset();
    this.registerForm.reset();
    this.activeTab = "login"
     })
     this.loginForm = this.fb.group({
      phone:[''],
       otp: [''],
       password:[''],
         email: ['']
    });
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.maxLength(5)]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]],
      otp: ['']
    });
   } catch (error) {
      console.log("error",error)
   }

    this.updateValidators();
  }

  onLoginModeChange() {
  this.loginForm.reset(); // optional
  this.loginOtpSent = false;
  this.updateValidators();
}
updateValidators() {
  const phoneControl = this.loginForm.get('phone');
  const otpControl = this.loginForm.get('otp');
  const emailControl = this.loginForm.get('email');
  const passwordControl = this.loginForm.get('password');

  if (this.loginMode === 'otp') {
    // ✅ OTP mode
    phoneControl?.setValidators([
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]);
   

    emailControl?.clearValidators();
    passwordControl?.clearValidators();

  } else {
    // ✅ Password mode
    emailControl?.setValidators([Validators.required, Validators.email]);
    passwordControl?.setValidators([Validators.required]);

    phoneControl?.clearValidators();
    otpControl?.clearValidators();
  }

  // 🔥 IMPORTANT: update validity
  phoneControl?.updateValueAndValidity();
  otpControl?.updateValueAndValidity();
  emailControl?.updateValueAndValidity();
  passwordControl?.updateValueAndValidity();
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
      this.startResendTimer(600)
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
    this.loginOtpSent = false;
    this.loginMode = "otp"

  }
    switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.resetOtpState();
    this.message =  "";
    this.successmessage = "";
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
    phone: this.registerForm.value.phone,
    otp: this.registerForm.value.otp
  };

  this.authService.verifyPhoneOtp(payload).subscribe({
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
sendOTP() {
  const payload = {
    phone: this.loginForm.get("phone")?.value
  };

  this.authService.sendLoginOtpMobile(payload).subscribe({
    next: (res: any) => {
    this.loginOtpSent = true;
     this.loginForm.get("otp")?.setValidators([Validators.required]);
    this.successmessage = 'OTP sent successfully';
    this.startResendTimer(600)
    },
    error: (err) => {
      console.error(err);
      alert(err.error?.message || 'Failed to send OTP');
    }
  });
}
verifyOTP() {
  const payload = {
    phone: this.loginForm.get('phone')?.value,
    otp: this.loginForm.get('otp')?.value
  };

  this.authService.verifyLoginOtpMobile(payload).subscribe({
    next: (res: any) => {
     this.authService.setSession(res);
      this.getCartDetails()
      this.closePopup();
    },
    error: (err) => {
      console.error(err);
      alert(err.error?.message || 'Invalid OTP');
    }
  });
}
handleOtpAction() {
  this.loginForm.markAllAsTouched();
  if(this.loginForm.valid){
 if (this.loginOtpSent) {
    this.verifyOTP();
  } else {
    this.sendOTP();
  }
  }
 
}

resendTimer: number = 0;
timerInterval: any;
startResendTimer(seconds: number = 600) {
  this.resendTimer = seconds;

  if (this.timerInterval) {
    clearInterval(this.timerInterval);
  }

  this.timerInterval = setInterval(() => {
    if (this.resendTimer > 0) {
      this.resendTimer--;
    } else {
      clearInterval(this.timerInterval);
    }
  }, 1000);
}

resendRegisterOtp(){
 const payload = {
    phone: this.loginForm.get("phone")?.value
  };

  this.authService.resendOtp(payload).subscribe({
    next: (res: any) => {
    this.loginOtpSent = true;
     this.loginForm.get("otp")?.setValidators([Validators.required]);
    this.successmessage = 'OTP sent successfully';
    this.startResendTimer(600)
    },
    error: (err) => {
      console.error(err);
      alert(err.error?.message || 'Failed to send OTP');
    }
  });
}
}
