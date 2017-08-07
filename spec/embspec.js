var request = require("request");


var base_url = "http://localhost:8040";

describe("API Tests", function() {
    describe("GET /", function() {

        it("Returns status 200", function() {
            request.get(base_url, function(err, res, body) {
                //expect(true).toBe(true);
                expect(res.status).toBe(200);
                done();
            });
        });


        it("Returns Hello World", function() {
            request.get(base_url, function(err, res, body) {
                expect(body).toBe("Hello World");
                done();
            });
        });

        /*it("Returns fasle", function() {
            //request.get(base_url, function(err, res, body) {
            expect(true).toBe(false);
            done();
            //});
        });*/

    });
    describe("GET signup", function() {
        var url = base_url + "/signup"
        it("Returns status 200", function() {
            request.get(url + "signup", function(err, res, body) {
                //expect(true).toBe(true);
                expect(res.status).toBe(404);
                done();
            });
        });


        it("Returns Hello World", function() {
            request.get(url + "signup", function(err, res, body) {
                expect(body).toBe("Hello World");
                done();
            });
        });

        it("Returns fasle", function() {
            //request.get(base_url, function(err, res, body) {
            expect(true).toBe(false);
            //done();
            //});
        });

    });
});