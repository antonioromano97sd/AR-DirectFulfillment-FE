import {Component, OnInit} from '@angular/core';
import {GetOrdersResponseModel} from '../../models/order.model';
import {OrdersService} from '../../services/orders.service';
import {OrderStatusEnum} from '../../models/order-status.enum';
import {translateOrderStatusEnumFunction} from '../../utils/generic-utils';


import {ActivatedRoute} from '@angular/router';
import {PagingModel} from '../../models/paging.model';
import {HttpParams} from '@angular/common/http';
import {OrderUtilService} from '../../services/order-util.service';
import {combineLatest} from 'rxjs';
import {swalSuccess, textSwalConfirmation} from '../../utils/swal.util';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-orders-dashboard',
  standalone: false,
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.css']
})
export class OrdersDashboardComponent implements OnInit {

  public currentWarehouse: string = '';
  public currentPage: number = 0;
  public maxPagesToShow: number = 5; // Numero massimo di pagine visibili
  public startPage: number = 0;
  public endPage: number = this.maxPagesToShow - 1;
  public orders!: PagingModel<GetOrdersResponseModel[]>;
  public orderStatusEnum = OrderStatusEnum;
  public translateOrderStatusEnumFunction = translateOrderStatusEnumFunction;
  public selectedOrder: GetOrdersResponseModel | null = null;

  public cancellationReason: string = '';

  private statusFilter!: OrderStatusEnum;
  private searchKeyValue: string | null = null;


  constructor(
    private ordersService: OrdersService,
    private orderUtilService: OrderUtilService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    combineLatest([
      this.route.params,
      this.orderUtilService.globalWarehouseSelected
    ]).subscribe(([routeData, warehouseValue]) => {
      this.statusFilter = routeData['status'] as OrderStatusEnum;
      this.currentPage = 0;
      this.currentWarehouse = warehouseValue
      this.loadOrders(this.currentPage);
    });
  }


  loadOrders(page: number): void {
    let httpParams: HttpParams = new HttpParams()
      .set('status', this.statusFilter)
      .set('page', page)
      .set('size', 20)
      .set('sortBy', 'id')
      .set('sortDirection', 'DESC');
    if (this.currentWarehouse !== 'ALL')
      httpParams = httpParams.set('warehouse', this.currentWarehouse)
    if (this.searchKeyValue)
      httpParams = httpParams.set('searchKey', this.searchKeyValue)
    this.ordersService.getOrders(httpParams).subscribe({
      next: (data) => {
        this.currentPage = data.pageNumber;
        this.orders = data || null;
        this.updatePageRange();
      },
      error: (err) => {
        console.error('Errore nel caricamento degli ordini:', err);
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.orders.totalPages) {
      this.loadOrders(page);
    }
  }

  // Aggiorna l'intervallo di pagine da mostrare
  updatePageRange(): void {
    const halfRange = Math.floor(this.maxPagesToShow / 2);
    if (this.currentPage - halfRange <= 0) {
      this.startPage = 0;
      this.endPage = Math.min(this.maxPagesToShow - 1, this.orders.totalPages - 1);
    } else if (this.currentPage + halfRange >= this.orders.totalPages) {
      this.startPage = this.orders.totalPages - this.maxPagesToShow;
      this.endPage = this.orders.totalPages - 1;
    } else {
      this.startPage = this.currentPage - halfRange;
      this.endPage = this.currentPage + halfRange;
    }
  }

  acceptOrder(order: GetOrdersResponseModel): void {
    textSwalConfirmation(`Stai accettando l'ordine ${order.code}`).then(result => {
      if (result.isConfirmed) {
        this.ordersService.updateStatusOrder({
          orderId: order.id,
          status: OrderStatusEnum.ACCEPTED
        }).subscribe({
          next: (response) => {
            swalSuccess(`Ordine ${order.code} accettato`)
            this.loadOrders(this.currentPage);
          },
          error: (err) => {
            console.error('Errore nell\'accettare l\'ordine:', err);
          }
        });
      }
    });
  }

  openRejectModal(content: any, order: GetOrdersResponseModel): void {
    this.selectedOrder = order;
    this.modalService.open(content, {centered: true}).result.then(
      (result) => {
        if (result === 'confirm') {
          this.rejectOrder(order);
        }
      },
      () => {
      }
    );
  }

  rejectOrder(order: GetOrdersResponseModel): void {
    this.ordersService.updateStatusOrder({
      orderId: order.id,
      status: OrderStatusEnum.CANCELLED,
      motivation: this.cancellationReason
    }).subscribe({
      next: (response) => {
        //this.orders = response;
        this.cancellationReason = '';
        this.modalService.dismissAll();
        this.loadOrders(this.currentPage);
      },
      error: (err) => {
        console.error('Errore nell\'accettare l\'ordine:', err);
      }
    });

  }


  printLabel(orderId: number): void {
    const blob = new Blob(['Simulazione etichetta ordine ' + orderId], {type: 'text/plain'});
    FileSaver.saveAs(blob, 'Etichetta_' + orderId);
  }

  searchKey($event: any) {
    if ($event.target.value && $event.target.value.trim().length > 0) {
      this.searchKeyValue = $event.target.value;
    } else {
      this.searchKeyValue = null;
    }
    this.loadOrders(this.currentPage);
  }
}
