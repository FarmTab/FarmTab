describe("Farm", function() {

  var farm;
  var farmer;
	
  beforeEach(function() {
    farmer = new Farmer({name: "Greg MacDonald"});
    farm = new Farm({farmerId: farmer.get('id')});
  }); 

  it("Should have a single farmer", function(){
  	expect(true).toBeTruthy(); // stub… 
  });

});