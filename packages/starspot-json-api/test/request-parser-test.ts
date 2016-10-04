import { expect } from "chai";
import RequestParser from "../src/request-parser";
import Operation from "../src/operation";
import { Container } from "starspot-core";

describe("Request Parser", function() {

  it("parses index requests", async function() {
    let params = new Parameters("photos#index");
    let container = new Container();

    container.registerFactory("resource", "photo", PhotoResource);

    let parser = new RequestParser(params, container);

    let operations = await parser.parse();

    expect(operations.length).to.equal(1);

    let operation = operations[0];
    expect(operation.op).to.equal("get");
    expect(operation.resource).to.be.an.instanceof(PhotoResource);
  });

});

function opName(operation: Operation) {
  return operation.op;
}

class PhotoResource {
}

class Parameters {
  public action: string;
  public controller: string;
  private _json: any;

  constructor(target: string, json?: any) {
    let [controller, action] = target.split("#", 2);
    this.controller = controller;
    this.action = action;

    this._json = json;
  }

  async json() {
    return this._json;
  }
}