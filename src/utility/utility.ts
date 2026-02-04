// src/utils/toast.ts
import { toast } from "react-toastify";

export const showSuccess = (msg: string) => toast.success(msg, { position: "top-center", autoClose: 3000, toastId: msg, });
export const showError = (msg: string) => toast.error(msg, { position: "top-center", autoClose: 3000, toastId: msg, });


// Encode id
export const base64Encode = (stringText: string) => window.btoa(stringText);
// Decode id
export const base64Decode = (stringText: string) => window.atob(stringText);


// This is date function for entre project
export function formatDate(value?: string | null): string {
  if (!value) return "N/A";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "N/A";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// This is time function for use entyreproject
export function formatTime(value?: string | null): string {
  if (!value) return "N/A";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "N/A";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}
