import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "Lucian",
  document: "123456789",
  items: [
    new InvoiceItem({
      id: new Id("1"),
      name: "item",
      price: 100,
    }),
  ],
  address: new Address(
    "Rua 123",
    "99",
    "Casa Verde",
    "Criciúma",
    "SC",
    "88888-888"
  ),
});

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find invoice use case unit test", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const sut = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await sut.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Lucian");
    expect(result.document).toBe("123456789");
    expect(result.address.street).toBe("Rua 123");
    expect(result.address.number).toBe("99");
    expect(result.address.complement).toBe("Casa Verde");
    expect(result.address.city).toBe("Criciúma");
    expect(result.address.state).toBe("SC");
    expect(result.address.zipCode).toBe("88888-888");
    expect(result.items.length).toBe(1);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("item");
    expect(result.items[0].price).toBe(100);
  });
});
