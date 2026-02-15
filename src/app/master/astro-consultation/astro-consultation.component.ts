import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AstroServiceService } from 'src/app/shared/astro-service.service';

@Component({
  selector: 'app-astro-consultation',
  templateUrl: './astro-consultation.component.html',
  styleUrls: ['./astro-consultation.component.css']
})
export class AstroConsultationComponent implements OnInit {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['',[Validators.required, Validators.email]],
    phone: ['',[
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]],
    birthDate: ['',Validators.required],
    birthTime: ['',Validators.required],
    birthPlace: ['',Validators.required],
    consultationType: ['',Validators.required],
    message: ['',Validators.required]
  });

  constructor(private fb: FormBuilder, private astro: AstroServiceService) {}

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.astro.addConsultation(this.form.value).subscribe(() => {
      alert('Consultation enquiry submitted');
      this.form.reset();
    });
  }

   ngOnInit(): void {
    
  }

}
