import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formTitle: string = 'Register';
  public isLoading: boolean = false;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onRegister(form: NgForm) {
    if (form.invalid)
      return;
    this.authService.createUser(
      form.value.userName,
      form.value.email,
      form.value.password
    );
  }

}
