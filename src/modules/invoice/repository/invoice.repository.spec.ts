import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice-item.model";
import Invoice from "../domain/invoice";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item";
import { ProductModel } from "../../product-adm/repository/product.model";
import ProductRepository from "../../product-adm/repository/product.repository";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepositoryRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceProps = {
      id: new Id("1"),
      name: "Invoice 1",
      document: "123456789",
      address: new Address(
        "Street",
        "123",
        "Complement",
        "City",
        "State",
        "ZipCode"
      ),
      items: [
        new InvoiceItem({
          id: new Id("1"),
          name: "Item 1",
          price: 100,
        }),
      ],
    };

    const invoice = new Invoice(invoiceProps);
    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoiceProps.id.id },
      include: [{ model: InvoiceItemModel }],
    });

    expect(invoiceProps.id.id).toEqual(invoiceDb.id);
    expect(invoiceProps.name).toEqual(invoiceDb.name);
    expect(invoice.document).toEqual(invoiceDb.document);
    expect(invoice.address.street).toEqual(invoiceDb.street);
    expect(invoice.address.number).toEqual(invoiceDb.number);
    expect(invoice.address.complement).toEqual(invoiceDb.complement);
    expect(invoice.address.city).toEqual(invoiceDb.city);
    expect(invoice.address.state).toEqual(invoiceDb.state);
    expect(invoice.address.zipCode).toEqual(invoiceDb.zipCode);
    expect(invoice.items[0].id.id).toEqual(invoiceDb.items[0].id);
    expect(invoice.items[0].name).toEqual(invoiceDb.items[0].name);
    expect(invoice.items[0].price).toEqual(invoiceDb.items[0].price);
  });

  it("should find a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    await InvoiceModel.create(
      {
        id: "1",
        name: "Invoice 1",
        document: "123456789",
        street: "Street",
        number: "123",
        complement: "Complement",
        city: "City",
        state: "State",
        zipCode: "ZipCode",
        items: [{ id: "1", name: "Item 1", price: 100 }],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    );

    const invoice = await invoiceRepository.find("1");

    expect(invoice.id.id).toEqual("1");
    expect(invoice.name).toEqual("Invoice 1");
    expect(invoice.document).toEqual("123456789");
    expect(invoice.address.street).toEqual("Street");
    expect(invoice.address.number).toEqual("123");
    expect(invoice.address.complement).toEqual("Complement");
    expect(invoice.address.city).toEqual("City");
    expect(invoice.address.state).toEqual("State");
    expect(invoice.address.zipCode).toEqual("ZipCode");
    expect(invoice.items[0].id.id).toEqual("1");
    expect(invoice.items[0].name).toEqual("Item 1");
    expect(invoice.items[0].price).toEqual(100);
  });
});
