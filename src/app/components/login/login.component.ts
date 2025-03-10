import {Component, OnDestroy} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginRequestModel } from '../../models/loginRequestModel';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  loginData: LoginRequestModel = new LoginRequestModel('', '');// Modello per username e password
  errorMessage: string = ''; // Messaggio di errore
  private s: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Chiama l'API di login con le credenziali
    this.authService.removeTokenFromLocalStorage();
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        // Salva il token nel localStorage
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Salvataggio del token nel localStorage
        }

        // Reindirizza alla dashboard dopo il login
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Credenziali non valide. Riprova.';
      }
    });
  }



  public ngOnDestroy(){
    // Annulla l'iscrizione per evitare memory leaks
    this.s?.unsubscribe();
  }
}
