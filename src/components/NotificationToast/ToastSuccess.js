import Swal from 'sweetalert2'

const ToastSuccess = Swal.mixin({
    toast: true,
    position: 'top-end', 
    iconColor: '#00E554',
    customClass: {
      popup: 'colored-toast',
      timerProgressBar: 'colored-progress-bar-success'
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  export default ToastSuccess;
