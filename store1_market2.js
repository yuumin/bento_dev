(function() {
  // ここから
  /*
  function something() {

  }
  */
  // ここまでの領域は好きに編集できます。

  var myStore = ObentoMarket.Store.entry('サンプル鉾之原商会',
    function(day) {
      // something();
      return {
        obentoId: 'ONIGIRI',
        purchaseNum: 500,
        salesPrice: 443
      }
    }
  );

})();
