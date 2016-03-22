/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 
 
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var listings = [];
var Settings = require('settings');
var Step = 0;

var getListing = function(data) {
  for (var i = 0; i < data.items.length; i++) {
      listings.push({
        title: data.items[i].title,
        subtitle: data.items[i].description,
        productid: data.items[i].id
      });
    }
  return listings;
};

Settings.config(
  { url: 'http://www.example.com' },
  function(e) {
    console.log('opening configurable');

    // Reset color to red before opening the webview
    Settings.option('color', 'red');
  },
  function(e) {
    console.log('closed configurable');
  }
);


var splash = new UI.Window();

var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Downloading karite listing data...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
	backgroundColor:'white'
});

// Add text to splash and display
splash.add(text);
splash.show();

ajax({ 
  url: 'https://www.karite.xyz/api/products/updated/newest', 
  headers: { 'start': 0, 'count': 15 }, 
  type: 'json' 
}, function(data) {
  var items = getListing(data);
  
  var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Listing',
        items: items
      }]
    });
  resultsMenu.show();
  splash.hide();
  
  
  
  resultsMenu.on('select', function(e) {
    var overview = new UI.Card({
      title: listings[e.itemIndex].title,
      body: listings[e.itemIndex].subtitle,
      scrollable: true
    });
    overview.show();
    resultsMenu.hide();
    
    overview.on('click', 'back', function() {
      resultsMenu.show();
      overview.hide();
    });
    
  });
});

