import Swal, {SweetAlertIcon, SweetAlertResult} from 'sweetalert2';

export function textSwalConfirmation(text: string, title?: string, confirmButtonText?: string, cancelButtonText?: string, icon: SweetAlertIcon = 'question') {
  return Swal.fire({
    title: title ? title : 'Sei sicuro ?',
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmButtonText ? confirmButtonText : 'Sì, sono sicuro',
    cancelButtonText: cancelButtonText ? cancelButtonText : 'No, annulla'
  });
}
export function htmlSwalConfirmation(html: string, title?: string, confirmButtonText?: string, cancelButtonText?: string, icon: SweetAlertIcon = 'question') {
  return Swal.fire({
    title: title ? title : 'Sei sicuro ?',
    html,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmButtonText ? confirmButtonText : 'Sì, sono sicuro',
    cancelButtonText: cancelButtonText ? cancelButtonText : 'No, annulla'
  });
}

export function swalSuccess(text: string): Promise<SweetAlertResult> {
  return Swal.fire(
    'All right!',
    text,
    'success'
  );
}

export function swalSuccessWithoutConfirmationButton(text: string): Promise<SweetAlertResult> {
  return Swal.fire({
      title: 'All right!',
      text,
      icon: 'success',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 5000,
    }
  );
}
