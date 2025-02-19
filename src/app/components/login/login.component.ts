import {Component, OnDestroy} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from '../../models/login.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  loginData: LoginModel = new LoginModel('', '');// Modello per username e password
  errorMessage: string = ''; // Messaggio di errore
  private s: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log('onSubmit() chiamato!');//per verificare se la funzione viene eseguita

    // Chiama l'API di login con le credenziali
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login avvenuto con successo:', response);

        // Reindirizza alla dashboard dopo il login
        this.router.navigate(['/orders-dashboard']).then(() => {
          console.log('Reindirizzamento eseguito con successo!');
        });
      },
      error: (err) => {
        console.error('⚠️ Errore nel login:', err);
        this.errorMessage = 'Credenziali non valide. Riprova.';
      }
    });
  }


  public ngOnDestroy(){
    // Annulla l'iscrizione per evitare memory leaks
    this.s?.unsubscribe();
  }
}
