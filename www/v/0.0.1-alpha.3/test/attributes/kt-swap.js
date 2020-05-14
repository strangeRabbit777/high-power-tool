describe("kt-swap attribute", function(){
    beforeEach(function() {
        this.server = makeServer();
        clearWorkArea();
    });
    afterEach(function()  {
        this.server.restore();
        clearWorkArea();
    });

    it('swap innerHTML properly', function()
    {
        this.server.respondWith("GET", "/test", '<a kt-get="/test2">Click Me</a>');
        this.server.respondWith("GET", "/test2", "Clicked!");

        var div = make('<div kt-get="/test"></div>')
        div.click();
        this.server.respond();
        div.innerHTML.should.equal('<a kt-get="/test2">Click Me</a>');
        var a = div.querySelector('a');
        a.click();
        this.server.respond();
        a.innerHTML.should.equal('Clicked!');
    });

    it('swap outerHTML properly', function()
    {
        this.server.respondWith("GET", "/test", '<a id="a1" kt-get="/test2">Click Me</a>');
        this.server.respondWith("GET", "/test2", "Clicked!");

        var div = make('<div id="d1" kt-get="/test" kt-swap="outerHTML"></div>')
        div.click();
        should.equal(byId("d1"), div);
        this.server.respond();
        should.equal(byId("d1"), null);
        byId("a1").click();
        this.server.respond();
        byId("a1").innerHTML.should.equal('Clicked!');
    });

    it('swap beforebegin properly', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" kt-get="/test2" kt-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div kt-get="/test" kt-swap="beforebegin">*</div>')
        var parent = div.parentElement;
        div.click();
        this.server.respond();
        div.innerText.should.equal("*");
        removeWhiteSpace(parent.innerText).should.equal("1*");

        byId("a1").click();
        this.server.respond();
        removeWhiteSpace(parent.innerText).should.equal("**");

        div.click();
        this.server.respond();
        div.innerText.should.equal("*");
        removeWhiteSpace(parent.innerText).should.equal("*2*");

        byId("a2").click();
        this.server.respond();
        removeWhiteSpace(parent.innerText).should.equal("***");
    });

    it('swap afterbegin properly', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" kt-get="/test2" kt-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div kt-get="/test" kt-swap="afterbegin">*</div>')
        div.click();
        this.server.respond();
        div.innerText.should.equal("1*");

        byId("a1").click();
        this.server.respond();
        div.innerText.should.equal("**");

        div.click();
        this.server.respond();
        div.innerText.should.equal("2**");

        byId("a2").click();
        this.server.respond();
        div.innerText.should.equal("***");
    });

    it('swap afterbegin properly with no initial content', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" kt-get="/test2" kt-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div kt-get="/test" kt-swap="afterbegin"></div>')
        div.click();
        this.server.respond();
        div.innerText.should.equal("1");

        byId("a1").click();
        this.server.respond();
        div.innerText.should.equal("*");

        div.click();
        this.server.respond();
        div.innerText.should.equal("2*");

        byId("a2").click();
        this.server.respond();
        div.innerText.should.equal("**");
    });

    it('swap afterend properly', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" kt-get="/test2" kt-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div kt-get="/test" kt-swap="afterend">*</div>')
        var parent = div.parentElement;
        div.click();
        this.server.respond();
        div.innerText.should.equal("*");
        removeWhiteSpace(parent.innerText).should.equal("*1");

        byId("a1").click();
        this.server.respond();
        removeWhiteSpace(parent.innerText).should.equal("**");

        div.click();
        this.server.respond();
        div.innerText.should.equal("*");
        removeWhiteSpace(parent.innerText).should.equal("*2*");

        byId("a2").click();
        this.server.respond();
        removeWhiteSpace(parent.innerText).should.equal("***");
    });

    it('swap beforeend properly', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" kt-get="/test2" kt-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div kt-get="/test" kt-swap="beforeend">*</div>')
        div.click();
        this.server.respond();
        div.innerText.should.equal("*1");

        byId("a1").click();
        this.server.respond();
        div.innerText.should.equal("**");

        div.click();
        this.server.respond();
        div.innerText.should.equal("**2");

        byId("a2").click();
        this.server.respond();
        div.innerText.should.equal("***");
    });

    it('swap beforeend properly with no initial content', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" kt-get="/test2" kt-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div kt-get="/test" kt-swap="beforeend"></div>')
        div.click();
        this.server.respond();
        div.innerText.should.equal("1");

        byId("a1").click();
        this.server.respond();
        div.innerText.should.equal("*");

        div.click();
        this.server.respond();
        div.innerText.should.equal("*2");

        byId("a2").click();
        this.server.respond();
        div.innerText.should.equal("**");
    });

    it('properly parses various swap specifications', function(){
        var swapSpec = kutty._("getSwapSpecification"); // internal function for swap spec
        swapSpec(make("<div/>")).swapStyle.should.equal("innerHTML")
        swapSpec(make("<div kt-swap='innerHTML'/>")).swapStyle.should.equal("innerHTML")
        swapSpec(make("<div kt-swap='innerHTML'/>")).swapDelay.should.equal(0)
        swapSpec(make("<div kt-swap='innerHTML'/>")).settleDelay.should.equal(100)
        swapSpec(make("<div kt-swap='innerHTML swap:10'/>")).swapDelay.should.equal(10)
        swapSpec(make("<div kt-swap='innerHTML settle:10'/>")).settleDelay.should.equal(10)
        swapSpec(make("<div kt-swap='innerHTML swap:10 settle:11'/>")).swapDelay.should.equal(10)
        swapSpec(make("<div kt-swap='innerHTML swap:10 settle:11'/>")).settleDelay.should.equal(11)
        swapSpec(make("<div kt-swap='innerHTML settle:11 swap:10'/>")).swapDelay.should.equal(10)
        swapSpec(make("<div kt-swap='innerHTML settle:11 swap:10'/>")).settleDelay.should.equal(11)
        swapSpec(make("<div kt-swap='innerHTML nonsense settle:11 swap:10'/>")).settleDelay.should.equal(11)
        swapSpec(make("<div kt-swap='innerHTML   nonsense   settle:11   swap:10  '/>")).settleDelay.should.equal(11)
    })

})
