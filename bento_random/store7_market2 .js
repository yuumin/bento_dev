(function() {

    
  var myStore = ObentoMarket.Store.entry('1/4の確率でうろちょろ',
    function(day) {
      // something();
	return {
	    var rand = Math.floor( Math.random() * 2 ) ;
	    if(rand<1/4){
		obentoId: 'ONIGIRI',
                purchaseNum: 10,
                salesPrice: 444
	    }
	    else if(rand<2/4){
		obentoId: 'MATSU',
                purchaseNum: 10,
                salesPrice: 4000
	    }
	    else if(rand<3/4){
		obentoId: 'TAKE',
                purchaseNum: 10,
                salesPrice: 2500
	    }
	    else{
		obentoId: 'UME',
                purchaseNum: 10,
                salesPrice: 1600
	    }
	
      }
    }
  );

})();
