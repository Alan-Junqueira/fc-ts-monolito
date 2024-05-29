import { Sequelize } from "sequelize-typescript";

import Address from "../../@shared/domain/value-object/address";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("Invoice Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const repository = new InvoiceRepository();
    const generateUseCase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      generateUseCase: generateUseCase,
      findUseCase: undefined,
    });

    const input = {
      id: "1",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      document: "123456789",
      name: "Name",
      items: [
        {
          id: "1",
          name: "item",
          price: 100,
        },
      ],
    };

    await facade.generate(input);

    const invoice = await InvoiceModel.findByPk("1", {
      include: [InvoiceItemModel],
    });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe("1");
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.address.street);
    expect(invoice.number).toBe(input.address.number);
    expect(invoice.complement).toBe(input.address.complement);
    expect(invoice.city).toBe(input.address.city);
    expect(invoice.state).toBe(input.address.state);
    expect(invoice.zipCode).toBe(input.address.zipCode);
    expect(invoice.items.length).toBe(1);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      document: "123456789",
      name: "Name",
      items: [
        {
          id: "1",
          name: "item",
          price: 100,
        },
      ],
    };

    await facade.generate(input);

    const invoice = await facade.find({ id: "1" });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe("1");
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.address.street).toBe(input.address.street);
    expect(invoice.address.number).toBe(input.address.number);
    expect(invoice.address.complement).toBe(input.address.complement);
    expect(invoice.address.city).toBe(input.address.city);
    expect(invoice.address.state).toBe(input.address.state);
    expect(invoice.address.zipCode).toBe(input.address.zipCode);
    expect(invoice.items.length).toBe(1);
  });
});
