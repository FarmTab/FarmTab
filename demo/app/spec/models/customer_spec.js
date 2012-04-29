describe("Customer", function() {
  var customer;

  beforeEach(function() {
    customer = new Customer();
  });

  it("should have a name", function() {
    customer.set({ name: 'Dickson Despommier' });
    expect(user.get('name')).toEqual('Dickson Despommier');
  });
  
  it ("should throw an error when no name has been added", function() {
  	errors = customer.validate();
  	expect(errors).toEqual("Customer name not set");
  });
  
  it("should have an email", function() {
    user.set({ email: 'adam@farmtab.com' });
    expect(user.get('email')).toEqual('adam@farmtab.com');
  });
  
  
});