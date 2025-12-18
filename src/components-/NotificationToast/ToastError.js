 
import Swal from 'sweetalert2'

 const ToastError = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: '#FF5A5A',
    customClass: {
      popup: 'colored-toast',
      timerProgressBar: 'colored-progress-bar-error',
    },
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
  })
  
  export default ToastError;
