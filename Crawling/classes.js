
class KindleBook {
  constructor(name, listPrice, description, imageUrls) {
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.imageUrls = imageUrls;
  }
}

class AudibleBook {
  constructor(name, listPrice, description, imageUrls) {
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.imageUrls = imageUrls;
  }
}

class HardcoverBook {
  constructor(name, listPrice, description, imageUrls) {
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.imageUrls = imageUrls;
  }
}

class PaperbackBook {
  constructor(name, listPrice, description, imageUrls) {
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.imageUrls = imageUrls;
  }
}

class GeneralProduct {
  constructor(name, listPrice, description, productDimensions, imageUrls, weight) {
    this.name = name;
    this.listPrice = listPrice;
    this.description = description;
    this.productDimensions = productDimensions;
    this.imageUrls = imageUrls;
    this.weight = weight;
  }
}

module.exports = {KindleBook, AudibleBook, HardcoverBook, PaperbackBook, GeneralProduct}
