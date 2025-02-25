import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';
import { OrderStatusService } from '../../services/order-status.service';
import { OrderStatus } from '../../models/order-status.enum';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-orders-dashboard',
  standalone: false,
  templateUrl: './orders-dashboard.component.html'
})
export class OrdersDashboardComponent implements OnInit {
  // Dati fniti degli ordini; Tipo order
  orders: Order[] = [];
  errorMessage: string = '';

  showRejectModal: boolean = false; // Per mostrare/nascondere la modale
  orderToRejectId: number | null = null; // ID dell'ordine da rifiutare

  // Variabile per il campo del motivo di rifiuto
  rejectReason: string = '';

  // Stato per la modale di stampa
  showPrintModal: boolean = false; // Variabile per mostrare la modale di stampa
  orderToPrintId: number | null = null; // Memorizza l'ID dell'ordine da stampare


  constructor(private ordersService: OrdersService,
              private orderStatusService: OrderStatusService // Inietta il servizio di traduzione)
  ){}

  ngOnInit(): void {
    this.loadOrders(); // Carichiamo gli ordini dal backend
  }

  getStatusDescription(status: OrderStatus): string {
    return this.orderStatusService.getDescription(status);
  }


loadOrders(): void {
  this.ordersService.getOrders().subscribe({
    next: (data) => {
      console.log('Ordini caricati:', data);
      this.orders = data.map(order => ({
        id: order.id,
        codeOrder: order.codeOrder,
        codeProduct: order.codeProduct,
        quantity: order.quantity,
        status: order.status as OrderStatus,
        orderDate: order.orderDate ? this.formatDateToItalian(order.orderDate) : 'Data non disponibile'
      }));
    },
    error: (err) => {
      console.error('Errore nel caricamento degli ordini:', err);
      this.errorMessage = 'Errore nel caricamento degli ordini. Riprova più tardi.';
    }
  });
}

formatDateToItalian(dateString: string): string {
  const date = new Date(dateString);
  return formatDate(date, 'd MMMM yyyy', 'it-IT'); // "2 febbraio 2024"
}




// Metodo per aprire la modale di stampa
  openPrintModal(orderId: number): void {
    this.orderToPrintId = orderId;
    this.showPrintModal = true;
  }
  // Metodo per chiudere la modale di stampa
  closePrintModal(): void {
    this.showPrintModal = false;
    this.orderToPrintId = null;
  }

  // chiama il backend per accettare un ordine
  acceptOrder(orderId: number): void {
    this.ordersService.acceptOrder(orderId).subscribe({
      next: (response) => {
        console.log(`Risposta dal backend: ${JSON.stringify(response)}`);

        console.log(`Ordine con ID ${orderId} accettato.`);

        // Modifica lo stato dell'ordine nella lista
        this.orders = this.orders.map(order =>
          order.id === orderId ? { ...order, status: OrderStatus.ACCEPTED } : order
        );

      },
      error: (err) => {
        console.error('Errore nell\'accettare l\'ordine:', err);
        this.errorMessage = 'Errore nell\'accettare l\'ordine. Riprova più tardi.';
      }
    });
  }

  // chiama il backend per rifiutare un ordine
  rejectOrderConfirmed(): void {

    if (this.orderToRejectId !== null && this.rejectReason.trim() !== '') {

      // log per vedere che la funzione è stata chiamata
      console.log(`Richiesta di rifiuto inviata per ordine ID: ${this.orderToRejectId}`);
      console.log(`Motivo del rifiuto: ${this.rejectReason}`);

      this.ordersService.rejectOrder(this.orderToRejectId, this.rejectReason).subscribe({
        next: () => {
          console.log(`Ordine con ID ${this.orderToRejectId} rifiutato e rimosso.`);

          // Rimuovi l'ordine dalla lista
          this.orders = this.orders.filter(order => order.id !== this.orderToRejectId);
          this.orderToRejectId = null;

          // Nascondi la modale
          this.showRejectModal = false;

          // Resetta il motivo del rifiuto
          this.rejectReason = '';

        },
        error: (err) => {
          console.error('Errore nel rifiutare l\'ordine:', err);
          this.errorMessage = 'Errore nel rifiutare l\'ordine. Riprova più tardi.';
        }
      });
    }
    else {
      // Aggiungi un log di errore per il motivo vuoto
      console.log('Errore: Il motivo del rifiuto non è stato inserito.');
    }
  }

  // Per la modale di conferma rifiuto
  openRejectModal(orderId: number): void {
    this.orderToRejectId = orderId; // Memorizziamo l'ID dell'ordine da rifiutare
    this.showRejectModal = true; // Mostriamo la modale
    this.rejectReason = ''; // Resetta il campo del motivo
  }
  closeRejectModal(event: MouseEvent): void {
    event.stopPropagation();
    this.showRejectModal = false;// Nasconde la modale
  }

  protected readonly OrderStatus = OrderStatus;
}
