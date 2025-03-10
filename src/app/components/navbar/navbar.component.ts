import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {OrderStatusEnum} from '../../models/order-status.enum';
import {OrderUtilService} from '../../services/order-util.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public warehouses: string[] = [];
  public selectedWarehouse: string = 'ALL';
  public orderStatusEnum = OrderStatusEnum;

  constructor(private authService: AuthService, private orderUtilService: OrderUtilService, private router: Router) {
  }

  ngOnInit(): void {
    this.warehouses = this.authService.getClaim('warehouses');
  }

  logout(): void {
    this.authService.removeTokenFromLocalStorage();// Pulisce il token e i dati dell'utente
    this.router.navigate(['/login']); // Reindirizza alla pagina di login
  }

  setGlobalWarehouse() {
    this.orderUtilService.setGlobalWarehouse(this.selectedWarehouse);
  }
}
