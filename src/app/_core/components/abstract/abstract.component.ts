import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-abstract',
  templateUrl: './abstract.component.html',
  styleUrls: ['./abstract.component.css']
})
export class AbstractComponent implements OnInit {

  createEventForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  get formControls() {
    return this.createEventForm.controls;
  }

  isValidInput(fieldName): boolean {
    return this.formControls[fieldName].invalid &&
      (this.formControls[fieldName].dirty || this.formControls[fieldName].touched)
  }

}
