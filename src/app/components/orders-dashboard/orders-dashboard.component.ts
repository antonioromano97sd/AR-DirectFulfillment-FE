import {Component, OnInit} from '@angular/core';
import {GetOrdersResponseModel} from '../../models/order.model';
import {OrdersService} from '../../services/orders.service';
import {OrderStatusEnum} from '../../models/order-status.enum';
import {formatDate} from '@angular/common';
import {translateOrderStatusEnumFunction} from '../../utils/generic-utils';

import { ActivatedRoute } from '@angular/router';

import { saveAs } from 'file-saver'; // Importa FileSaver.js

@Component({
  selector: 'app-orders-dashboard',
  standalone: false,
  templateUrl: './orders-dashboard.component.html'
})
export class OrdersDashboardComponent implements OnInit {
  // Dati fniti degli ordini; Tipo order
  orders: GetOrdersResponseModel[] = [];
  errorMessage: string = '';
  isCancelled: boolean = false; // flag per determinare gli ordini cancellati e distinguere gli ordini


  showRejectModal: boolean = false; // Per mostrare/nascondere la modale
  orderToRejectId: number | null = null; // ID dell'ordine da rifiutare

  // Variabile per il campo del motivo di rifiuto
  rejectReason: string = '';

  // Stati per gestire il pulsante di stampa
  printedOrders: Set<number> = new Set(); // Salva ID degli ordini già stampati

  public translateOrderStatusEnumFunction = translateOrderStatusEnumFunction


  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute // Per ottenere il parametro dalla rotta per gli ordini cancellati
  ) {
  }

  ngOnInit(): void {
    this.route.url.subscribe((urlSegments) => {
      // Se la rotta è /dashboard/cancelled-orders, carica gli ordini cancellati
      if (urlSegments.length > 0) {
        // Controlla il path per determinare se sono ordini cancellati
        console.log("Path:", urlSegments[0].path);
        this.isCancelled = urlSegments[0].path === 'cancelled-orders';
        console.log("IsCancelled:", this.isCancelled);

        this.loadOrders(); // Carica gli ordini dal BE con il filtro corretto
      }
    });
  }


  loadOrders(): void {
    this.ordersService.getOrders(this.isCancelled).subscribe({
      next: (data) => {
        console.log('Ordini caricati:', data);
        this.orders = data || [];
      },
      error: (err) => {
        console.error('Errore nel caricamento degli ordini:', err);
        this.orders = []; // si a3ssicura che la tabella sia vuota in caso di errore
        this.errorMessage = this.isCancelled
          ? 'Errore nel caricamento degli ordini cancellati. Riprova più tardi.'
          : 'Errore nel caricamento degli ordini. Riprova più tardi.';
      }
    });
  }


  formatDateToItalian(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date, 'd MMMM yyyy', 'it-IT'); // "2 febbraio 2024"
  }


// Metodo per scaricare il file dell'etichetta (per ora un file fittizio)
  printLabel(orderId: number): void {
    const blob = new Blob(['Simulazione etichetta ordine ' + orderId], { type: 'text/plain' });
    saveAs(blob, `etichetta_${orderId}.txt`);

    // Disabilita il bottone per questo ordine
    this.printedOrders.add(orderId);
  }

  // Metodo per verificare se il pulsante deve essere disabilitato
  isLabelPrinted(orderId: number): boolean {
    return this.printedOrders.has(orderId);
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
// Metodi per la modale di caricamento ricevuta
  openUploadReceiptModal(orderId: number): void {
    this.orderToUploadId = orderId;
    this.showUploadReceiptModal = true;
  }

  closeUploadReceiptModal(): void {
    this.showUploadReceiptModal = false;
    this.orderToUploadId = null;
  }

  protected readonly OrderStatus = OrderStatusEnum;
}
