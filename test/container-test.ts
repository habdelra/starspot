import { expect } from "chai";
import Container from "../src/container";

describe("Container", function() {

  it("allows explicitly registering factories", function() {
    let container = new Container();

    class PhotosController {
      isPhotosFactory = true;
    }

    container.registerFactory("controller", "photos", PhotosController);

    let controller = container.findInstance("controller", "photos");
    expect(controller.isPhotosFactory).to.be.true;

    let Factory = container.findFactory("controller", "photos");
    controller = new Factory();
    expect(controller.isPhotosFactory).to.be.true;
  });

  it("injects properties into specific objects", function() {
    let container = new Container();

    class PhotosController {
      isPhotosFactory = true;
    }

    class PostsController {
      isPostsController = true;
    }

    container.registerFactory("controller", "photos", PhotosController);
    container.registerFactory("controller", "posts", PostsController);

    container.inject(["controller", "photos"], {
      with: ["controller", "posts"],
      as: "posts"
    });

    let photosController = container.findInstance("controller", "photos");
    let postsController = container.findInstance("controller", "posts");
    expect(photosController.posts).to.equal(postsController);
    expect(photosController.constructor).to.equal(PhotosController);
    expect(photosController).to.be.an.instanceof(PhotosController);

    let Factory = container.findFactory("controller", "photos");
    photosController = new Factory();
    expect(photosController.posts).to.equal(postsController);
    expect(photosController.constructor).to.equal(PhotosController);
    expect(photosController).to.be.an.instanceof(PhotosController);
  });

  it("injects properties into types of objects", function() {
    let container = new Container();

    class PhotosController {
      isPhotosFactory = true;
    }

    class DBService {
      isDBService = true;
    }

    container.registerFactory("controller", "photos", PhotosController);
    container.registerFactory("service", "db", DBService);

    container.inject("controller", {
      with: ["service", "db"],
      as: "db",
      annotation: "inject-db-into-controllers"
    });

    let photosController = container.findInstance("controller", "photos");
    let dbService = container.findInstance("service", "db");
    expect(photosController.db).to.equal(dbService);
    expect(photosController.constructor).to.equal(PhotosController);
    expect(photosController).to.be.an.instanceof(PhotosController);

    let Factory = container.findFactory("controller", "photos");
    photosController = new Factory();
    expect(photosController.db).to.equal(dbService);
    expect(photosController.constructor).to.equal(PhotosController);
    expect(photosController).to.be.an.instanceof(PhotosController);
  });

});