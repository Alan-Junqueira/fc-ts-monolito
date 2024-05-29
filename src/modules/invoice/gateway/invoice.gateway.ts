import Invoice from "../domain/invoice";


export default interface InvoiceGateway {
  generate(input: Invoice): Promise<Invoice>;
  find(id: string): Promise<Invoice>;
}
