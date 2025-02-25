import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-print-modal',
  standalone: false,
  templateUrl: './print-modal.component.html'
})
export class PrintModalComponent {
  @Input() orderId: number | null = null;
  @Output() close = new EventEmitter<void>();

  selectedFile: File | null = null;
  errorMessage: string = '';

  constructor(private ordersService: OrdersService) {}

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.errorMessage = '';
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Nessun file selezionato!';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.ordersService.uploadOrderFile(this.orderId, formData).subscribe({
      next: () => {
        alert('File caricato con successo!');
        this.close.emit();
      },
      error: (error: Error) => {
        this.errorMessage = 'Errore nel caricamento del file!';
        console.error(error);
      }
    });
  }

}
