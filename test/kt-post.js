describe("kt-post attribute", function(){
    beforeEach(function() {
        this.server = makeServer();
        clearWorkArea();
    });
    afterEach(function()  {
        this.server.restore();
        clearWorkArea();
    });

    it('issues a POST request with proper headers', function()
    {
        this.server.respondWith("POST", "/test", function(xhr){
            should.equal(xhr.requestHeaders['X-HTTP-Method-Override'], undefined);
            xhr.respond(200, {}, "Posted!");
        });

        var btn = make('<button kt-post="/test">Click Me!</button>')
        btn.click();
        this.server.respond();
        btn.innerHTML.should.equal("Posted!");
    });
})
