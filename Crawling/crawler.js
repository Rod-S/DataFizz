//import dependencies/modules
const fs = require("fs");
const cheerio = require("cheerio");
const rp = require("request-promise");
const {KindleBook, AudibleBook, HardcoverBook, PaperbackBook, Other} = require("./classes.js");
const {formatDate, objectLength} = require('./functions.js')

//declare arrays
var productURLs = [];
var totalProducts = [];

//crawler entry point domain
const domain = "https://www.amazon.com";

//resource to search
//try replacing /books with /electronics for partial results
const path = '/books';

//initial request options
let options = {
  method: 'GET',
  uri: domain,
  gzip: true,
  decodeEntities: true,
  transform: function (body) {
        return cheerio.load(body);
    }
}

//create data folder if it does not exist
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
  console.log('./data subdirectory successfully created.')
}

//JSON file creation, convert product data array into object collection and write to JSON file
const createJSON = () => {
  var nonEmptyProducts=[];
  for (let i=0; i< totalProducts.length; i++) {
    if (totalProducts[i].name != '' || totalProducts[i].description != '') {
      nonEmptyProducts.push(totalProducts[i])
    }
}
  const jsonFileName = `./data/${formatDate()}.json`;
  const stream = fs.createWriteStream((jsonFileName));
  totalObjectData = Object.assign({}, nonEmptyProducts);
  for (var i = 0; i < objectLength(totalObjectData); i++) {
    totalObjectData[i].id = i;
  }
  allObjectsJSON = JSON.stringify(totalObjectData);
  stream.write(allObjectsJSON);
  console.log('Data successfully written to JSON file.');
}

//Display Error log and create Error file on Errors
const errorMsg = (err) => {
  if (err) {
    let error = `'There was an error! Error Name: ${err.name}, Error Message: ${err.message}`;
    console.log(`Error Name: ${err.name}, Error Message: ${err.message}`);
    const errorFile = fs.createWriteStream("scraper-error.log");
    errorFile.write('[' + new Date() + ']' + ' <' + error + '>');
  }
}

//npm start message
console.log('Executing crawler.js');

//Begin scraping https://www.amazon.com/
rp(options).then(
  function($) {
    console.log("Entry point: 'https://www.amazon.com'");
    options.uri = domain + path;

    //navigate to category path ie) https://www.amazon.com/books
    rp(options).then(
       function($) {
         console.log(`Crawling '${path}' route.`)

        //push all product urls on page into products array
        $('.a-link-normal').each(function(i, elem){
          var hrefSubstring = $(elem).attr('href').split('/');
          if ((hrefSubstring[1] + '/' + hrefSubstring[2]) == 'gp/product') {
            //filter out audible page which shares same gp/(product) path as other book products
            if (hrefSubstring[3] != "B00NB86OYE") {
              productURLs.push(domain + "/" + hrefSubstring[1] + '/' + hrefSubstring[2] + '/' + hrefSubstring[3])
            }
          }
        })
        console.log('Processing URLs...Please wait.')

        //iterate over each productURL in productURLs array
        for (let productURL of productURLs) {
          options.uri = productURL

          //retrieve product details within each book product page
          rp(options).then(
            function($) {

              //array and function to push multiple images into for each object
              var imageURL = [];
              var getImgURL = () => {
                if ($('#main-image').attr('src')) {
                  imageURL.push($('#main-image').attr('src'))
                }
                if ($('#ebooksImgBlkFront').attr('src')) {
                  imageURL.push($('#ebooksImgBlkFront').attr('src'))
                }
                $('.a-spacing-micro > img').each(function(i, elem) {
                  if ($(elem) != undefined) {
                    imageURL.push($(elem).attr('src'));
                  }
                })
                }
                getImgURL();


              //if Kindle Book, create kindleBook object
              if ($('.a-button-selected > span:nth-child(1):contains(Kindle)').text().trim().length) {
                var kindleBook = new KindleBook(
                  null,
                  $('#ebooksProductTitle').text().trim(),
                  parseFloat($('.kindlePriceLabel').next().text().trim().split(' ')[0].replace('$', '')),
                  $('#bookDescription_feature_div').text().replace(/<\/?[^>]+(>|$)/g, "").replace('/\s+/gS', '').replace('Read more', '').replace('Read less', '').trim(),
                  imageURL.push($('#ebooksImgBlkFront').attr('src')),
                  productURL
                )
                kindleBook['imageURLs'].push(imageURL);
                kindleBook['imageURLs'].shift([0][0]);
                kindleBook['type'] = 'kindle_book';
                totalProducts.push(kindleBook);

                //if Audible Book, create audibleBook object
              } if ($('#title > span:contains(Audible Audiobook)').text().trim().length) {
                  var audibleBook = new AudibleBook(
                    null,
                    $('#productTitle').text().trim(),
                    parseFloat($('#audible_buybox_accordion > div:nth-child(6) > div > div.a-accordion-row-a11y > a > h5 > div > div.a-column.a-span4.a-text-right.a-span-last > span').text().trim().split(' ')[0].replace('$', '')),
                    $('#bookDescription_feature_div').text().replace(/<\/?[^>]+(>|$)/g, "").replace('/\s+/gS', '').replace('Read more', '').replace('Read less', '').trim(),
                    $('#main-image').attr('src'),
                    productURL
                  )
                  audibleBook['imageURLs'].push(imageURL);
                  audibleBook['imageURLs'].shift([0][0]);
                  audibleBook['type'] = 'audible_book';
                  totalProducts.push(audibleBook);

                //if Hardcover Book, create hardcoverBook object
              } if ($('#title > span:contains(Hardcover)').text().trim() == 'Hardcover') {
                  var hardcoverBook = new HardcoverBook(
                    null,
                    $('#productTitle').text().trim(),
                    parseFloat($('span.a-size-medium.a-color-price.offer-price.a-text-normal').text().trim().split(' ')[0].replace('$', '')),
                    $('#bookDescription_feature_div').text().trim().replace(/<\/?[^>]+(>|$)/g, "").replace('/\s+/gS', '').replace('Read more', '').replace('Read less', '').trim(),
                    $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Dimensions:)").text().replace('Product Dimensions: ', '').replace('/\s+/gS', '').trim(),
                    $('.a-spacing-micro > img').attr('src'),
                    $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Shipping Weight:)").text().replace('Shipping Weight: ', '').replace(' (View shipping rates and policies)', '').trim(),
                    productURL
                  )
                  hardcoverBook['imageURLs'].push(imageURL);
                  hardcoverBook['imageURLs'].shift([0][0]);
                  hardcoverBook['type'] = 'hardcover_book';
                  totalProducts.push(hardcoverBook);

                //if Paperback Book, create paperbackBook object
              } if ($('#title > span:contains(Paperback)').text().trim() == 'Paperback') {
                var paperbackBook = new PaperbackBook(
                  null,
                  $('#productTitle').text().trim(),
                  parseFloat($('#buyNewSection > h5 > div > div.a-column.a-span8.a-text-right.a-span-last > div > span.a-size-medium.a-color-price.offer-price.a-text-normal').text().trim().split(' ')[0].replace('$', '')),
                  $('#bookDescription_feature_div').text().replace(/<\/?[^>]+(>|$)/g, "").replace('/\s+/gS', '').replace('Read more', '').replace('Read less', '').trim(),
                  $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Dimensions:)").text().replace('Product Dimensions: ', '').replace('/\s+/gS', '').trim(),
                  $('.a-spacing-micro > img').attr('src'),
                  $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Shipping Weight:)").text().replace('Shipping Weight: ', '').replace(' (View shipping rates and policies)', '').trim(),
                  productURL
                )
                paperbackBook['imageURLs'].push(imageURL);
                paperbackBook['imageURLs'].shift([0][0]);
                paperbackBook['type'] = 'paperback_book';
                totalProducts.push(paperbackBook);

                //if not any of 4 main book categories
              } if (!kindleBook && !audibleBook && !hardcoverBook && !paperbackBook) {
                var other = new Other(
                  null,
                  $('#productTitle').text().trim(),
                  parseFloat($('span.a-size-medium.a-color-price.offer-price.a-text-normal').text().trim().split(' ')[0].replace('$', '')) || parseFloat($("#priceblock_ourprice").text().trim().replace('$', '')),
                  $('#bookDescription_feature_div').text().replace(/<\/?[^>]+(>|$)/g, "").replace('/\s+/gS', '').replace('Read more', '').replace('Read less', '').trim(),
                  $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Dimensions:)").text().trim().replace('Product Dimensions: ', '').replace(/\n/g, '').replace('Package Dimensions: ', '').replace('\n', '').trim(),
                  $('.a-spacing-micro > img').attr('src'),
                  $("#productDetailsTable > tbody > tr > td > div > ul > li:contains(Shipping Weight:)").text().trim().replace('Shipping Weight: ', '').replace(' (View shipping rates and policies)', '').replace('Package Dimensions:', ''),
                  productURL
                )
                other['imageURLs'].push(imageURL);
                other['imageURLs'].shift([0][0]);
                other['type'] = $('#title > span:nth-child(2)').text() || 'other';
                totalProducts.push(other);
              }
            }
          ).then((result)=> {
              if (totalProducts.length == productURLs.length) {
                //create JSON file once all product links have been iterated through
                createJSON();
              }
            }).catch((err) => {errorMsg(err)})
        }
    }).catch((err) => {errorMsg(err)})
  }
).catch((err) => {errorMsg(err);})
