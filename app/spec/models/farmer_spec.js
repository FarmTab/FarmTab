describe("Farmer", function() {
  var farmer;

  beforeEach(function() {
    farmer = new Farmer();
    farmer.url = '/';
  });

  it("should have a name", function() {
    farmer.set({ name: "Dickson Despommier" });
    expect(farmer.get('name')).toEqual("Dickson Despommier");
  });
  
  it("should have an email", function() {
    farmer.set({ email: "adam@farmtab.com", name: "Greg MacDonald" });
    expect(farmer.get('email')).toEqual("adam@farmtab.com");
  });
});