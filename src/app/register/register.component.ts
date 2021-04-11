import { Component, OnInit } from '@angular/core';
import { RegisterUser } from '../RegisterUser';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerUser: RegisterUser = {userName: "", password: "", password2: ""};
  public warning: string | null = "";
  public success: boolean = false;
  public loading: boolean = false;

  constructor(private auth:AuthService, private router:Router) { }


  ngOnInit(): void {

  }

  onSubmit(f: NgForm): void {
    if(this.registerUser.userName != "" && this.registerUser.password === this.registerUser.password2) {
      this.loading = true;
      this.auth.register(this.registerUser)
      .subscribe((success) => {
        this.success = true;
        this.warning = null;
        this.loading = false;
      }, (err) =>{
        this.success = false;
        this.loading = false;
        this.warning = err.error.message;
      });
    }
    else {
      this.warning = "Passwords don't match each other";
    }
  }

}
