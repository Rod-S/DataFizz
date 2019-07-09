
class KindleBook {
  constructor(id, name, listPrice, description, imageURLs, sourceURL) {
    this.id = id;
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.imageURLs = [imageURLs];
    this.sourceURL = sourceURL;
  }
}

class AudibleBook {
  constructor(id, name, listPrice, description, imageURLs, sourceURL) {
    this.id = id;
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.imageURLs = [imageURLs];
    this.sourceURL = sourceURL;
  }
}

class HardcoverBook {
  constructor(id, name, listPrice, description, productDimensions, imageURLs, weight, sourceURL) {
    this.id = id;
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.productDimensions = productDimensions;
    this.imageURLs = [imageURLs];
    this.weight = weight;
    this.sourceURL = sourceURL;
  }
}

class PaperbackBook {
  constructor(id, name, listPrice, description, productDimensions, imageURLs, weight, sourceURL) {
    this.id = id;
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.productDimensions = productDimensions;
    this.imageURLs = [imageURLs];
    this.weight = weight;
    this.sourceURL = sourceURL;
  }
}

class Other {
  constructor(id, name, listPrice, description, productDimensions, imageURLs, weight, sourceURL) {
    this.id = id;
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.productDimensions = productDimensions;
    this.imageURLs = [imageURLs];
    this.weight = weight;
    this.sourceURL = sourceURL;
  }
}

module.exports = {KindleBook, AudibleBook, HardcoverBook, PaperbackBook, Other}
