"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** Isolated client component so react-toastify's CSS/JS never touches server rendering. */
export function ToastViewport() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3500}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="light"
    />
  );
}
