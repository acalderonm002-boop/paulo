"use client";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/528128625350"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(37,211,102,0.55)] hover:scale-110 transition-transform duration-300"
      style={{ backgroundColor: "#25D366" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-7 h-7 lg:w-8 lg:h-8 fill-white"
        aria-hidden="true"
      >
        <path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1-1.2-.5-2.3-1.4a8.7 8.7 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.5a.6.6 0 0 0 0-.5c-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5H8a1 1 0 0 0-.8.4 3.2 3.2 0 0 0-1 2.4 5.6 5.6 0 0 0 1.2 3 12.7 12.7 0 0 0 4.8 4.3c.7.3 1.2.5 1.6.6a3.9 3.9 0 0 0 1.8.1 2.9 2.9 0 0 0 1.9-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.4Zm-5.5 7.5h0a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.9 9.9 0 1 1 8.3 4.6Zm8.4-18.3A11.8 11.8 0 0 0 2.1 17.5L.5 23.5l6.2-1.6a11.8 11.8 0 0 0 5.6 1.5h0a11.8 11.8 0 0 0 8.3-20.2Z" />
      </svg>
    </a>
  );
}
