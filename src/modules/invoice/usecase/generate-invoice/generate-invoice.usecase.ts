import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private invoicesRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const props = {
      id: new Id(input.id) || new Id(),
      address: new Address(
        input.address.street,
        input.address.number,
        input.address.complement,
        input.address.city,
        input.address.state,
        input.address.zipCode
      ),
      document: input.document,
      name: input.name,
      items: input.items.map(
        (item) =>
          new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
    }

    const invoice = new Invoice(props);
    const persistInvoice = await this.invoicesRepository.generate(invoice);

    return {
      id: persistInvoice.id.id,
      name: persistInvoice.name,
      document: persistInvoice.document,
      street: persistInvoice.address.street,
      number: persistInvoice.address.number,
      complement: persistInvoice.address.complement,
      city: persistInvoice.address.city,
      state: persistInvoice.address.state,
      zipCode: persistInvoice.address.zipCode,
      items: persistInvoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: persistInvoice.total(),
    };
  }
}
