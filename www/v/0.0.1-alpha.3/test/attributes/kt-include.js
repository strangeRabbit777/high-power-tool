describe("kt-include attribute", function() {
    beforeEach(function () {
        this.server = makeServer();
        clearWorkArea();
    });
    afterEach(function () {
        this.server.restore();
        clearWorkArea();
    });

    it('By default an input includes itself', function () {
        this.server.respondWith("POST", "/include", function (xhr) {
            var params = parseParams(xhr.requestBody);
            params['i1'].should.equal("test");
            xhr.respond(200, {}, "Clicked!")
        });
        var div = make('<div kt-target="this"><input kt-post="/include" kt-trigger="click" id="i1" name="i1" value="test"/></div>')
        var input = byId("i1")
        input.click();
        this.server.respond();
        div.innerHTML.should.equal("Clicked!");
    });

    it('non-GET includes closest form', function () {
        this.server.respondWith("POST", "/include", function (xhr) {
            var params = parseParams(xhr.requestBody);
            params['i1'].should.equal("test");
            xhr.respond(200, {}, "Clicked!")
        });
        var div = make('<form kt-target="this"><div id="d1" kt-post="/include"></div><input name="i1" value="test"/></form>')
        var input = byId("d1")
        input.click();
        this.server.respond();
        div.innerHTML.should.equal("Clicked!");
    });

    it('GET does not include closest form by default', function () {
        this.server.respondWith("GET", "/include", function (xhr) {
            var params = parseParams(xhr.requestBody);
            should.equal(params['i1'], undefined);
            xhr.respond(200, {}, "Clicked!")
        });
        var div = make('<form kt-target="this"><div id="d1" kt-get="/include"></div><input name="i1" value="test"/></form>')
        var input = byId("d1")
        input.click();
        this.server.respond();
        div.innerHTML.should.equal("Clicked!");
    });

    it('Input not included twice when in form', function () {
        this.server.respondWith("POST", "/include", function (xhr) {
            var params = parseParams(xhr.requestBody);
            params['i1'].should.equal("test");
            xhr.respond(200, {}, "Clicked!")
        });
        var div = make('<form kt-target="this"><input kt-post="/include" kt-trigger="click" id="i1" name="i1" value="test"/></form>')
        var input = byId("i1")
        input.click();
        this.server.respond();
        div.innerHTML.should.equal("Clicked!");
    });

    it('Two inputs are included twice when they have the same name', function () {
        this.server.respondWith("POST", "/include", function (xhr) {
            var params = parseParams(xhr.requestBody);
            params['i1'].should.deep.equal(["test", "test2"]);
            xhr.respond(200, {}, "Clicked!")
        });
        var div = make('<form kt-target="this">' +
            '<input kt-post="/include" kt-trigger="click" id="i1" name="i1" value="test"/>' +
            '<input name="i1" value="test2"/>' +
            '</form>')
        var input = byId("i1")
        input.click();
        this.server.respond();
        div.innerHTML.should.equal("Clicked!");
    });

    it('Input not included twice when it explicitly refers to parent form', function () {
        this.server.respondWith("POST", "/include", function (xhr) {
            var params = parseParams(xhr.requestBody);
            params['i1'].should.equal("test");
            xhr.respond(200, {}, "Clicked!")
        });
        var div = make('<form id="f1" kt-target="this">' +
            '<input kt-include="#f1" kt-post="/include" kt-trigger="click" id="i1" name="i1" value="test"/>' +
            '</form>')
        var input = byId("i1")
        input.click();
        this.server.respond();
        div.innerHTML.should.equal("Clicked!");
    });

    it('Input can be referred to externally', function () {
        this.server.respondWith("POST", "/include", function (xhr) {
            var params = parseParams(xhr.requestBody);
            params['i1'].should.equal("test");
            xhr.respond(200, {}, "Clicked!")
        });
        make('<input id="i1" name="i1" value="test"/>');
        var div = make('<div kt-post="/include" kt-include="#i1"></div>')
        div.click();
        this.server.respond();
        div.innerHTML.should.equal("Clicked!");
    });

    it('Two inputs can be referred to externally', function () {
        this.server.respondWith("POST", "/include", function (xhr) {
            var params = parseParams(xhr.requestBody);
            params['i1'].should.equal("test");
            params['i2'].should.equal("test");
            xhr.respond(200, {}, "Clicked!")
        });
        make('<input id="i1" name="i1" value="test"/>');
        make('<input id="i2" name="i2" value="test"/>');
        var div = make('<div kt-post="/include" kt-include="#i1, #i2"></div>')
        div.click();
        this.server.respond();
        div.innerHTML.should.equal("Clicked!");
    });

    it('A form can be referred to externally', function () {
        this.server.respondWith("POST", "/include", function (xhr) {
            var params = parseParams(xhr.requestBody);
            params['i1'].should.equal("test");
            params['i2'].should.equal("test");
            xhr.respond(200, {}, "Clicked!")
        });
        make('<form id="f1">' +
            '<input name="i1" value="test"/>' +
            '<input  name="i2" value="test"/>' +
            '</form> ');
        var div = make('<div kt-post="/include" kt-include="#f1"></div>')
        div.click();
        this.server.respond();
        div.innerHTML.should.equal("Clicked!");
    });

});