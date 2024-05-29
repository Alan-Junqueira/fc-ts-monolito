import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  address: new Address(
    "street",
    "number",
    "complement",
    "city",
    "state",
    "zipCode"
  ),
  document: "document",
  name: "name",
  items: [
    new InvoiceItem({
      id: new Id("1"),
      name: "item",
      price: 100,
    }),
  ],
});

const MockRepository = () => {
  return {
    generate: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    find: jest.fn(),
  };
};

describe("Generate invoice usecase unit test", () => {
  it("should generate a invoice", async () => {
    const invoiceRepository = MockRepository();
    const sut = new GenerateInvoiceUseCase(invoiceRepository);
    const input = {
      address: new Address(
        "street",
        "number",
        "complement",
        "city",
        "state",
        "zipCode"
      ),
      document: "document",
      name: "name",
      items: [
        {
          id: "1",
          name: "item",
          price: 100,
        },
      ],
    };

    const result = await sut.execute(input);

    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.street).toBe(invoice.address.street);
    expect(result.number).toBe(invoice.address.number);
    expect(result.complement).toBe(invoice.address.complement);
    expect(result.city).toBe(invoice.address.city);
    expect(result.state).toBe(invoice.address.state);
    expect(result.zipCode).toBe(invoice.address.zipCode);
    expect(result.items[0].id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.total).toBe(invoice.total());
    expect(invoiceRepository.generate).toHaveBeenCalled();
  });
});
