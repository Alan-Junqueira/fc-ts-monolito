import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findByPk(id, {
      include: [{ model: InvoiceItemModel }],
    });

    if (!invoice) {
      throw new Error(`"Invoice with id ${id} not found"`);
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode
      ),
      items: invoice.items.map(
        (item) =>
          new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
    });
  }

  async generate(input: Invoice): Promise<Invoice> {
    await InvoiceModel.create(
      {
        id: input.id.id,
        name: input.name,
        document: input.document,
        street: input.address.street,
        number: input.address.number,
        complement: input.address.complement,
        city: input.address.city,
        state: input.address.state,
        zipCode: input.address.zipCode,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
        items: input.items.map((item) => ({
          name: item.name,
          id: item.id.id,
          price: item.price,
        })),
      },
      {
        include: [InvoiceItemModel],
      }
    );

    return new Invoice({
      id: input.id,
      name: input.name,
      document: input.document,
      address: new Address(
        input.address.street,
        input.address.number,
        input.address.complement,
        input.address.city,
        input.address.state,
        input.address.zipCode
      ),
      items: input.items.map(
        (item) =>
          new InvoiceItem({
            id: item.id,
            name: item.name,
            price: item.price,
          })
      ),
    });
  }
}
