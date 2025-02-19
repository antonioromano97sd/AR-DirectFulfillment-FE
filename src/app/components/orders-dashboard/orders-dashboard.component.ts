import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders-dashboard',
  standalone: false,
  templateUrl: './orders-dashboard.component.html',
  styleUrl: './orders-dashboard.component.css'
})
export class OrdersDashboardComponent implements OnInit {
  // Dati finti degli ordini; Tipo order
  orders: Order[] = [
    new Order(1, '1234', 'ABC123', 10, '2025-02-18'),
    new Order(2, '5678', 'DEF456', 5, '2025-02-17'),
    new Order(3, '91011', 'GHI789', 3, '2025-02-16')
  ];
  errorMessage: string = '';

  showRejectModal: boolean = false; // Per mostrare/nascondere la modale
  orderToRejectId: number | null = null; // ID dell'ordine da rifiutare

  constructor() {}

  ngOnInit(): void {
    // Qui andrebbero le chiamate HTTP per recuperare gli ordini reali dal backend
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
