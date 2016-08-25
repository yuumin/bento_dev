
(function() {
function Initialize()
{
      activity.obentoId = 'ONIGIRI';
      activity.purchaseNum = 20;
      activity.salesPrice = 444;
}

  var myStore = ObentoMarket.Store.entry('価格調整さん',function(day) {
      var histories = ObentoMarket.getHistory();
      var yesterday = histories[day - 2];
      var ids = ObentoMarket.Store.getCompetitorIds(myStore.id);
      for (var i=0; i<ids.length; i++)
      {
        var storeInfo = ObentoMarket.Store.getById(ids[i]);
        var actual = yesterday.storeActuals[ids[i]];
      }
      return{};
      var activity = {};
    var yesterday = histories[day - 2];
                                         var ids = ObentoMarket.Store.getCompetitorIds(myStore.id);
                                         for (var i = 0; i < ids.length; i++) {
                                         var storeInfo = ObentoMarket.Store.getById(ids[i]);
                                         var actual = yesterday.storeActuals[ids[i]];
                                         obentoName = actual.obentoId;
                                         switch(obentoName)
                                         {
                                         case 'MATSU': matsuCount++;
                                         break;
                                         case 'TAKE' : takeCount++;
                                         break;
                                         case 'UME' : umeCount++;
                                         break;
                                         case 'ONIGIRI' : onigiriCount++;
                                         break;
                                         }
                                         }
                                         
                                         
      return activity;
    }
  );

})();
