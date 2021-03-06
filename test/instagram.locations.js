(function() {
  /*
  Test Setup
  */  var Init, Instagram, app, assert, completed, should, test, to_do;
  console.log("\nInstagram API Node.js Lib Tests :: Locations");
  Init = require('./initialize');
  Instagram = Init.Instagram;
  app = Init.app;
  assert = require('assert');
  should = require('should');
  test = require('./helpers');
  completed = 0;
  to_do = 0;
  /*
  Tests
  */
  module.exports = {
    'locations#info for id#1': function() {
      return test.helper('locations#info for id#1', Instagram, 'locations', 'info', {
        location_id: 1
      }, function(data) {
        data.should.have.property('name', 'Dogpatch Labs');
        test.output("data had the property 'name' equal to 'Dogpatch Labs'");
        data.latitude.should.be.above(0);
        test.output("data had the property 'latitude' greater than zero", data.latitude);
        data.longitude.should.be.below(0);
        test.output("data had the property 'longitude' less than zero", data.longitude);
        return app.finish_test();
      });
    },
    'locations#recent for id#1': function() {
      return test.helper('locations#recent for id#1', Instagram, 'locations', 'recent', {
        location_id: 1
      }, function(data, pagination) {
        data.length.should.be.above(0);
        test.output("data had length greater than 0", data.length);
        data[0].should.have.property('id');
        test.output("data[0] had the property 'id'", data[0].id);
        pagination.should.have.property('next_url');
        test.output("pagination had the property 'next_url'", pagination.next_url);
        pagination.should.have.property('next_max_id' || pagination.should.have.property('next_min_id'));
        test.output("pagination had the property 'next_max_id' or 'next_min_id'", pagination);
        return app.finish_test();
      });
    },
    'locations#search for 48.858844300000001/2.2943506': function() {
      return test.helper('locations#search for 48.858844300000001/2.2943506', Instagram, 'locations', 'search', {
        lat: 48.858844300000001,
        lng: 2.2943506
      }, function(data) {
        data.length.should.be.above(0);
        test.output("data had length greater than 0", data.length);
        data[0].should.have.property('id');
        test.output("data[0] had the property 'id'", data[0].id);
        data[0].should.have.property('name');
        test.output("data[0] had the property 'name'", data[0].name);
        return app.finish_test();
      });
    },
    'locations#search for 40.77/-73.98 with count 60': function() {
      return test.helper('locations#search for 40.77/-73.98 with count 60', Instagram, 'locations', 'search', {
        lat: 40.77,
        lng: -73.98,
        distance: 5000,
        count: 60
      }, function(data) {
        data.length.should.equal(60);
        test.output("data had length of 60", data.length);
        return app.finish_test();
      });
    },
    'locations#subscriptions': function() {
      return test.helper("locations#subscriptions subscribe to location '1257285'", Instagram, 'locations', 'subscribe', {
        object_id: '1257285'
      }, function(data) {
        var subscription_id;
        data.should.have.property('id');
        test.output("data had the property 'id'");
        data.id.should.be.above(0);
        test.output("data.id was greater than 0", data.id);
        data.should.have.property('type', 'subscription');
        test.output("data had the property 'type' equal to 'subscription'", data);
        subscription_id = data.id;
        return test.helper('locations#subscriptions list', Instagram, 'subscriptions', 'list', {}, function(data) {
          var found, i;
          data.length.should.be.above(0);
          test.output("data had length greater than 0", data.length);
          found = false;
          for (i in data) {
            if (data[i].id === subscription_id) {
              found = true;
            }
          }
          if (!found) {
            throw "subscription not found";
          }
          test.output("data had the subscription " + subscription_id);
          return test.helper("locations#subscriptions unsubscribe from location '1257285'", Instagram, 'locations', 'unsubscribe', {
            id: subscription_id
          }, function(data) {
            if (data !== null) {
              throw "location '1257285' unsubscribe failed";
            }
            test.output("data was null; we unsubscribed from the subscription " + subscription_id);
            return app.finish_test();
          });
        });
      });
    }
  };
  /*
  count seems to return n-1 results; e.g. request 50 returns 49, request 30 returns 29,...
  
    'locations#recent for id#1 with count of 50': ->
      test.helper 'locations#recent for id#1 with count of 50', Instagram, 'locations', 'recent', { location_id: 1, count: 50 }, (data, pagination) ->
        data.length.should.equal 49
        test.output "data had length of 49"
        app.finish_test()
  */
  app.start_tests(module.exports);
}).call(this);
