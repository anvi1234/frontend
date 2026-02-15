import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  templateUrl: './error-widget.component.html',
  styleUrls: ['./error-widget.component.css']
})
export class ErrorWidgetComponent implements OnInit {
 @Input() control!: AbstractControl | null;
 @Input() errorLabel = 'This field';
  constructor() { }

  ngOnInit(): void {
  }

}
