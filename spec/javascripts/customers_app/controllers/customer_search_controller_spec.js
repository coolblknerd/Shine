describe("CustomerSearchController", function(){
  describe("Initialization", function() {

    // Initialization Set-up ------------

    var scope = null,
    controller = null;

    beforeEach(module("customers")); // <-- loads the app

    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller("CustomerSearchController", { $scope: scope });
    }));

    // Initialization Test ---------

    it("defaults to an empty customer list", function() {
      expect(scope.customers).toEqualData([]);
    });
  });

  describe("Fetching Search Results", function() {

    // Fetching Search Results Set-up ------------

    var scope = null,
    controller = null,
    httpBackend = null,
    serverResults = [
      {
        id: 123,
        first_name: "Bob",
        last_name: "Jones",
        email: "bjones@foo.net",
        username: "jonesy"
      },
      {
        id: 456,
        first_name: "Bob",
        last_name: "Johnsons",
        email: "johnboy@bar.info",
        username: "bobbyj"
      }
    ];

    beforeEach(module("customers"));

    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      controller = $controller("CustomerSearchController", {
        $scope: scope
      }); // -- controller
    })); // -- beforeEach(inject)

    beforeEach(function() {
      httpBackend.when('GET', '/customers.json?keywords=bob&page=0').respond(serverResults);
    });

    // Fetching search results Test ------------

    it("populates the customer list with the results", function() {
      scope.search("bob");
      httpBackend.flush();
      expect(scope.customers).toEqualData(serverResults);
    }); // -- "populates the customer..."
  }); // -- "Fetching search results"

  describe("Error Handling", function() {

    // Error Handling Set-up -------------

    var scope = null,
    controller = null,
    httpBackend = null;

    beforeEach(module("customers"));

    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      controller = $controller("CustomerSearchController", {
        $scope: scope
      }); // -- controller
    })); // -- beforeEach(inject)

    beforeEach(function() {
      httpBackend.when('GET', '/customers.json?keywords=bob&page=0').respond(500,'Internal Server Error');
      spyOn(window, "alert");
    });

    // Error Handling Test --------------

    it("alerts the user on an error", function() {
      scope.search("bob");
      httpBackend.flush();
      expect(scope.customers).toEqualData([]);
      expect(window.alert).toHaveBeenCalledWith("There was a problem: 500");
    }); // "alerts the user..." ----------
  }); // "Error handling..." -------------

}); // "ControllerSearchController" -----------
