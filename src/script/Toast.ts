// import { toast } from "react-toastify";
import toast from "react-hot-toast";
// import "react-toastify/dist/ReactToastify.css";

// export function toastSuccess(title: any) {
//   return toast.success(title, {
//     position: toast.POSITION.BOTTOM_LEFT,
//   });
// }

// export function toastError(title: any) {
//   return toast.error(title, {
//     position: toast.POSITION.BOTTOM_LEFT,
//   });
// }

export function toastError(title: any) {
  return toast.error(title)
}

export function toastSuccess(title: any) {
  return toast.success(title)
}
