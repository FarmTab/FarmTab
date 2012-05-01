describe("Customer", function() {
  var customer;

  beforeEach(function() {
    customer = new Customer();
    customer.url = '/';
  });

  it("should have a name", function() {
    customer.set({ name: "Dickson Despommier" });
    expect(customer.get('name')).toEqual("Dickson Despommier");
  });
  
  it ("should throw an error when no name has been added", function() {
  	customer.validate();
  	expect(customer.errors).toEqual({"name": ["is required"]});
  });
  
  it("should have an email", function() {
    customer.set({ email: "adam@farmtab.com" });
    expect(customer.get('email')).toEqual("adam@farmtab.com");
  });
  
  
});