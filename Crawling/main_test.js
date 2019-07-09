var expect = require('chai').expect;

// Test suite


describe('Mocha', function () {
  it('should run our tests using npm', function(){
    expect(true).to.be.ok;
  });
});

//Test for KindleBook Class instantiating properly
describe ('New KindleBook', function() {
  KindleBook = require('./classes.js').KindleBook;
  it('should be an instance of KindleBook', function(){
    expect(new KindleBook).to.be.an.instanceof(KindleBook);
  })
})
//Test for AudibleBook Class instantiating properly
describe ('New AudibleBook', function() {
  AudibleBook = require('./classes.js').AudibleBook;
  it('should be an instance of AudibleBook', function(){
    expect(new AudibleBook).to.be.an.instanceof(AudibleBook);
  })
})
//Test for HardcoverBook Class instantiating properly
describe ('New HardcoverBook', function() {
  HardcoverBook = require('./classes.js').HardcoverBook;
  it('should be an instance of KindleBook', function(){
    expect(new HardcoverBook).to.be.an.instanceof(HardcoverBook);
  })
})
//Test for PaperbackBook Class instantiating properly
describe ('New PaperbackBook', function() {
  PaperbackBook = require('./classes.js').PaperbackBook;
  it('should be an instance of KindleBook', function(){
    expect(new PaperbackBook).to.be.an.instanceof(PaperbackBook);
  })
})
//Test for Other Class instantiating properly
describe ('New Other', function() {
  Other = require('./classes.js').Other;
  it('should be an instance of Other', function(){
    expect(new Other).to.be.an.instanceof(Other);
  })
})

//Test instantiated objects for converting to valid JSON
describe('JSON Conversion', function() {
  var totalProducts = [{id: 0, name: 'name', listPrice: 12.00, description: 'description', productDimensions: 'dimensions', imageURLs: 'www.123.com', weight: 'weight', sourceURL: 'www.123.com'}]
  it('should be converted into valid JSON without error', function () {
      expect(JSON.stringify(totalProducts)).to.be.ok;
  });
});
