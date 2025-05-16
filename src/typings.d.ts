declare module 'html2pdf.js' {
    export interface Options {
      margin?: number | number[];
      filename?: string;
      html2canvas?: any;
      jsPDF?: any;
      pagebreak?: any;
    }
    const html2pdf: any;
    export default html2pdf;
  }
  