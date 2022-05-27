import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SyuserService } from 'src/app/services/syuser.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;

  constructor(
    private syUserService: SyuserService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  login() {
    let data = {
      username: this.username,
      password: this.password
    }
    this.authService.login(data).subscribe(result => {
      if (result.serviceResult.status === "Success") {
        localStorage.setItem("userInfo", JSON.stringify(result.serviceResult.value));
        this.router.navigate(["./"]);
      } else {
        Swal.fire("Error !", result.serviceResult.text, "error");
      }
    }, err => {
      console.error(err);
      Swal.fire("Error !", err.message, "error");
    })
  }
}
