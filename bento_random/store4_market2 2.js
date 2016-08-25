
(function() {
function Initialize()
{
      activity.obentoId = 'ONIGIRI';
      activity.purchaseNum = 20;
      activity.salesPrice = 444;
}

  var myStore = ObentoMarket.Store.entry('ニッチくん',function(day) {
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
      if(day == 1)
      {
      activity.obentoId = 'ONIGIRI';
      activity.purchaseNum = 20;
      activity.salesPrice = 444;
      }
      else if(day >= 2)
      {
      activity.obentoId = 'ONIGIRI';
      activity.purchaseNum = 20;
      activity.salesPrice = 444;
      }
      return activity;
    }
  );

})();
