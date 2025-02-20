import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders-dashboard',
  standalone: false,
  templateUrl: './orders-dashboard.component.html',
  styleUrl: './orders-dashboard.component.css'
})
export class OrdersDashboardComponent implements OnInit {
  // Dati finti degli ordini; Tipo order
  orders: Order[] = [];
  errorMessage: string = '';

  showRejectModal: boolean = false; // Per mostrare/nascondere la modale
  orderToRejectId: number | null = null; // ID dell'ordine da rifiutare

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders(); // Carichiamo gli ordini dal backend
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        this.orders = data; // Popoliamo l'array di ordini
      },
      error: (err) => {
        console.error('Errore nel caricamento degli ordini:', err);
        this.errorMessage = 'Errore nel caricamento degli ordini. Riprova più tardi.';
      }
    });
  }

  // Metodo per accettare un ordine
  acceptOrder(orderId: number): void {
    console.log(`Ordine con ID ${orderId} accettato.`);
    // eventualmente implementare una chiamata API per aggiornare lo stato dell'ordine
  }

  // Metodo per aprire la modale di rifiuto
  openRejectModal(orderId: number): void {
    this.orderToRejectId = orderId; // Memorizziamo l'ID dell'ordine da rifiutare
    this.showRejectModal = true; // Mostriamo la modale
  }

  // Metodo per chiudere la modale
  closeRejectModal(): void {
    this.showRejectModal = false; // Nasconde la modale
  }

  // Metodo per confermare il rifiuto
  rejectOrderConfirmed(): void {
    if (this.orderToRejectId !== null) {
      // Rimuovi l'ordine dalla lista
      this.orders = this.orders.filter(order => order.id !== this.orderToRejectId);
      console.log(`Ordine con ID ${this.orderToRejectId} rifiutato e rimosso dalla tabella.`);
      // Resettiamo l'ID dell'ordine da rifiutare
      this.orderToRejectId = null;
      this.closeRejectModal(); // Chiudiamo la modale
    }
  }
}
