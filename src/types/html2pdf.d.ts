declare module 'html2pdf.js' {
  interface Options {
    margin?: number;
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: { scale: number };
    jsPDF?: { unit: string; format: string; orientation: string };
  }

  interface Html2PdfInstance {
    set: (options: Options) => Html2PdfInstance;
    from: (element: HTMLElement) => Html2PdfInstance;
    save: () => void;
  }

  function html2pdf(): Html2PdfInstance;
  export = html2pdf;
}
