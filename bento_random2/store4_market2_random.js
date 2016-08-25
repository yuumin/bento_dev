 (function() {
  

  var myStore = ObentoMarket.Store.entry('合理的ランダム実装中',function(day) {

     var rand = Math.floor(Math.random()*4)+1;
    var randOni = Math.floor( Math.random()*245)+200;//原価以上標準価格以下の価格をランダムに発生
    var randMatsu = Math.floor( Math.random()*2801)+1200;
    var randTake = Math.floor( Math.random()*1501)+1000;
    var randUme = Math.floor( Math.random()*801)+800;
    var randPurchaseNumMatsu = Math.floor( Math.random()*21)+10;//10以上30以下の購入数をランダムに決定
    var randPurchaseNumTake = Math.floor( Math.random()*21)+10;
    var randPurchaseNumUme = Math.floor( Math.random()*21)+10;
    var randPurchaseNumOni = Math.floor( Math.random()*21)+10;
    

    
    
     var storeInfo = ObentoMarket.Store.getById(myStore.id);
     var histories = ObentoMarket.getHistory();
     
     var activity = {};
     var purchaseNum = activity.purchaseNum;
     //const minPri = 2000;
     //const matsuPri = 40;
     //const getMatsuPri = 1200;
     //const stromPro = 0.01;
     //const rate = 0.80;
     //const rand = 1 //Math.floor(Math.random()*6)+1; //1~7の整数型変数を生成
     //const upperline = 100000000;
     //const underline = 12000;
     
     //maxNum = Math.floor((storeInfo.capitalStock - minPri)/(getMatsuPri - stromPro*matsuPri));
     
     if(rand==1){
     activity.obentoId = 'ONIGIRI';
     activity.purchaseNum= randPurchaseNumOni;
     activity.salesPrice= randOni;
     }
     else if(rand==2){
     activity.obentoId = 'MATSU';
     activity.purchaseNum= randPurchaseNumMatsu;
     activity.salesPrice= randMatsu;
     }
     else if(rand==3){
     activity.obentoId = 'TAKE';
     activity.purchaseNum= randPurchaseNumTake;
     activity.salesPrice= randTake;
     }
     else{
     activity.obentoId = 'UME';
     activity.purchaseNum= randPurchaseNumUme;
     activity.salesPrice= randUme;
     }
     return activity;
     }
     );
  })();








