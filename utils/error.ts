export class OrderFlowError extends Error {
  public title: string;

  constructor(title: string, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.title = title;
  }
}
