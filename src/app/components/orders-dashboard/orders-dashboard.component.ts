import {Component, OnInit} from '@angular/core';
import {GetOrdersResponseModel} from '../../models/order.model';
import {OrdersService} from '../../services/orders.service';
import {OrderStatusEnum} from '../../models/order-status.enum';
import {formatDate} from '@angular/common';
import {translateOrderStatusEnumFunction} from '../../utils/generic-utils';

@Component({
  selector: 'app-orders-dashboard',
  standalone: false,
  templateUrl: './orders-dashboard.component.html'
})
export class OrdersDashboardComponent implements OnInit {
  // Dati fniti degli ordini; Tipo order
  orders: GetOrdersResponseModel[] = [];
  errorMessage: string = '';

  showRejectModal: boolean = false; // Per mostrare/nascondere la modale
  orderToRejectId: number | null = null; // ID dell'ordine da rifiutare

  // Variabile per il campo del motivo di rifiuto
  rejectReason: string = '';

  // Stato per la modale di stampa
  showPrintModal: boolean = false; // Variabile per mostrare la modale di stampa
  orderToPrintId: number | null = null; // Memorizza l'ID dell'ordine da stampare

  public translateOrderStatusEnumFunction = translateOrderStatusEnumFunction


  constructor(
    private ordersService: OrdersService
  ) {
  }

  ngOnInit(): void {
    this.loadOrders(); // Carichiamo gli ordini dal backend
  }


  loadOrders(): void {
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        console.log('Ordini caricati:', data);
        this.orders = data || [];
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
    this.ordersService.updateStatusOrder({
      orderId,
      status: OrderStatusEnum.ACCEPTED
    }).subscribe({
      next: (response) => {
        this.orders = response
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

      this.ordersService.updateStatusOrder({
        orderId: this.orderToRejectId,
        status: OrderStatusEnum.CANCELLED,
        motivation: this.rejectReason
      }).subscribe({
        next: (response) => {
          this.orders = response;
          this.closeRejectModal();
        },
        error: (err) => {
          console.error('Errore nell\'accettare l\'ordine:', err);
          this.errorMessage = 'Errore nell\'accettare l\'ordine. Riprova più tardi.';
        }
      });
    } else {
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

  closeRejectModal(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.showRejectModal = false;// Nasconde la modale
  }

  protected readonly OrderStatus = OrderStatusEnum;
}
