import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AstroServiceService } from 'src/app/shared/astro-service.service';

@Component({
  selector: 'app-astro-education',
  templateUrl: './astro-education.component.html',
  styleUrls: ['./astro-education.component.css']
})
export class AstroEducationComponent implements OnInit {
form = this.fb.group({
    name: ['', Validators.required],
    email: ['',[Validators.required, Validators.email]],
    phone: ['',[
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]],
    course: ['', Validators.required],
    experienceLevel: ['', Validators.required],
    message: ['']
  });

  constructor(private fb: FormBuilder, private astro: AstroServiceService) {}

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.astro.addEducation(this.form.value).subscribe(() => {
      alert('Education  enquiry submitted');
      this.form.reset();
    });
  }

   ngOnInit(): void {
    
  }


}
