(function() {

  var myStore = ObentoMarket.Store.entry('りんご',function(day) {
      var storeInfo = ObentoMarket.Store.getById(myStore.id);
      var histories = ObentoMarket.getHistory();

      var activity = {};
      var purchaseNum = activity.purchaseNum;
      const minOniPri = 2000;
      const matsuPri = 40;
      const getMatsuPri = 1200;
      const stromPro = 0.1;
      const rate = 0.80;
      const rand = 1 //Math.floor(Math.random()*6)+1; //1~7の整数型変数を生成
      const upperline = 100000000;
      const underline = 12000;

      maxNum = Math.floor((minOniPri - storeInfo.capitalStock)/(stromPro*matsuPri - getMatsuPri))-3;
      if(day == 1)
      {
        activity.purchaseNum = 300;
        activity.obentoId = 'MATSU';
      }
      else if(day >= 2){
        var yesterday = histories[day - 2];
        var actual = yesterday.storeActuals[myStore.id];
        if(storeInfo.capitalStock < underline)
          {
            activity.purchaseNum = Math.floor(storeInfo.capitalStock/200);
            activity.obentoId = 'ONIGIRI';
          }
          else
          {
          }
        if(storeInfo.capitalStock > upperline)
          {
            if(rand == 1)
            {
              activity.purchaseNum = Math.floor((storeInfo.capitalStock/200)*rate);
              activity.obentoId = 'ONIGIRI';
            }
            else
            {
            if(yesterday.weather == ObentoMarket.Weather.SHINE){
            activity.purchaseNum = Math.floor((storeInfo.capitalStock/1200)*rate);
            activity.obentoId = 'MATSU';
            }else if (yesterday.weather == ObentoMarket.Weather.CLOUD){
              activity.purchaseNum = Math.floor((storeInfo.capitalStock/1000)*rate);
              activity.obentoId = 'TAKE';
            }else if (yesterday.weather == ObentoMarket.Weather.RAIN){
              activity.purchaseNum = Math.floor((storeInfo.capitalStock/800)*rate);
              activity.obentoId = 'UME';
            }
            else
            {
              activity.purchaseNum = Math.floor((storeInfo.capitalStock/1200)*rate);
              activity.obentoId = 'MATSU';
            }
          }
        }
        else
        {
          if(yesterday.weather == ObentoMarket.Weather.SHINE){
            activity.purchaseNum = Math.floor((storeInfo.capitalStock/1200)*rate);
            activity.obentoId = 'MATSU';
          }else if (yesterday.weather == ObentoMarket.Weather.CLOUD){
            activity.purchaseNum = Math.floor((storeInfo.capitalStock/1000)*rate);
            activity.obentoId = 'TAKE';
          }else if (yesterday.weather == ObentoMarket.Weather.RAIN){
            activity.purchaseNum = Math.floor((storeInfo.capitalStock/800)*rate);
            activity.obentoId = 'UME';
          }
          else
          {
            activity.purchaseNum = Math.floor((storeInfo.capitalStock/1000)*rate);
            activity.obentoId = 'TAKE';
          }
        }
      }
      return activity;
    }
  );
})();