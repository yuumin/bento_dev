(function(root, factory) {

  root.ObentoMarket = factory(root, {}, root.$, root._);

}(this, function(root, ObentoMarket, $, _) {

  /** @namespace ObentoMarket */
  ObentoMarket.VERSION = '0.0.1';

  // テスト用格納
  ObentoMarket.__ = {};


  /**
   * 天気の種類を表す定数オブジェクト。
   *
   * @example
   * if (weather == ObentoMarket.Weather.SHINE) {
   *   :
   * } else if (weather == ObentoMarket.Weather.CLOUD) {
   *   :
   *   :
   * }
   *
   * @readonly
   * @prop {number} SHINE 晴れ
   * @prop {number} CLOUD 雲り
   * @prop {number} RAIN 雨
   * @prop {number} STORM 嵐
   */
  ObentoMarket.Weather = {
    'SHINE': 0,
    'CLOUD': 1,
    'RAIN': 2,
    'STORM': 3
  };

  /**
   * お弁当の種類を表すオブジェクト。
   *
   * @example
   * 仕入お弁当に幕の内弁当（松）を設定。
   * var activity = {};
   * activity.obentoId = ObentoMarket.Obento.MATSU;
   * :
   *
   * @readonly
   * @prop {object} MATSU 幕の内弁当（松）
   * @prop {object} TAKE 幕の内弁当（竹）
   * @prop {object} UME 幕の内弁当（梅）
   * @prop {object} ONIGIRI おにぎり
   */
  ObentoMarket.Obento = {
    'MATSU': {
      id: 'MATSU',
      dispName: '幕の内弁当（松）',
      purchasePrice: 1200,
      defaultSalesPrice: 4000,
      sellRate: [0.31, 0.305, 0.305, 0.01]
    },
    'TAKE': {
      id: "TAKE",
      dispName: "幕の内弁当（竹）",
      purchasePrice: 1000,
      defaultSalesPrice: 2500,
      sellRate: [0.405, 0.42, 0.405, 0.01]
    },
    'UME': {
      id: "UME",
      dispName: "幕の内弁当（梅）",
      purchasePrice: 800,
      defaultSalesPrice: 1600,
      sellRate: [0.505, 0.505, 0.52, 0.01]
    },
    'ONIGIRI': {
      id: "ONIGIRI",
      dispName: "おにぎり",
      purchasePrice: 200,
      defaultSalesPrice: 444,
      sellRate: [0.451, 0.451, 0.451, 0.5]
    }
  };

  /**
   * お店管理オブジェクト。
   */
  var StoreManager = {
    ids: [],
    stores: {}
  };

  /**
   * お店を作成する。
   * @param {string} name
   * @param {function} activity
   */
  StoreManager.establish = function(name, activity)
  {
    var store = Store.create(name, activity);
    this.stores[store.id] = store;
    this.ids.push(store.id);
    return this.getById(store.id);
  };

  /**
   * ID指定でお店(クローン)を取得する。
   *
   * @param {string} id お店ID
   * @returns {object} お店情報
   */
  StoreManager.getById = function(id)
  {
    var store = this.stores[id];
    return (!store) ? null : store.attrs();
  };

  /**
   * 指定のIDに金額を追加する。
   * @param id
   * @param amount
   */
  StoreManager.credit = function(id, amount)
  {
    this.stores[id].capitalStock += amount;
  };

  StoreManager.clear = function()
  {
    this.stores = {};
    this.ids = [];
  };

  var Store = function(name, activity)
  {
    this.initialize.apply(this, arguments);
  };

  _.extend(Store.prototype, {

    initialize: function(name, activity, initialCapitalStock)
    {
      this.id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
      this.name = name;
      this.activity = activity || this.activity;
      this.capitalStock = initialCapitalStock;
    },

    activity: function(day) {
      return {
        obentoId: 'MATSU',
        purchaseNum: 10,
        salesPrice: ObentoMarket.Obento.MATSU.defaultSalesPrice
      }
    },

    attrs: function()
    {
      return {
        id: this.id,
        name: this.name,
        capitalStock: this.capitalStock
      }
    }
  });

  _.extend(Store, {

    create: function(name, activity)
    {
      return new Store(name, activity, Market.Env.initialCapitalStock);
    }
  });

  /**
   * お店に関わる名前空間。
   * @namespace
   */
  ObentoMarket.Store = {
  };

  /**
   * お店を市場に登録する。
   *
   * @param name {string} お店の名前
   * @param activity {function} その日の活動を行う関数
   *
   * @return {object} お店情報
   */
  ObentoMarket.Store.entry = function(name, activity) {
    return StoreManager.establish(name, activity);
  };

  /**
   * 指定のIDでお店を取得する。<br/>
   * 存在しないIDを指定した場合はNULLを返す。
   *
   * @example
   * // store -> {
   * //   id: 'xxxx',
   * //   name: '大川商店',
   * //   capitalStock: 1000000
   * // }
   * var store = ObentoMarket.Store.getById('xxxx');
   *
   * @param id {string} お店のID
   * @return {object} お店情報
   */
  ObentoMarket.Store.getById = function(id)
  {
    return StoreManager.getById(id);
  };

  /**
   * お店のID一覧を取得する。
   *
   * @example
   * var ids = ObentoMarket.Store.getIds();
   * for (var i = 0; i < ids.length; i++) {
   *   var store = ObentoMarket.Store.getById(ids[i]);
   *   :
   *   :
   * }
   *
   * @returns {object} お店情報
   */
  ObentoMarket.Store.getIds = function()
  {
    return StoreManager.ids;
  };

  ObentoMarket.Store.getCompetitorIds = function(storeId)
  {
    return _.without(StoreManager.ids, storeId);
  };

  // 市場オブジェクト
  var Market = {
    history: []
  };

  // 市場環境の初期値
  Market.DefaultEnv = {
    weatherUrl: 'http://localhost:3000/api/weather',
    rule: '1',
    numOfDays: 360,
    minObentoPurchaseNum: 10,
    initialCapitalStock: 1000000
  };

  Market.Env = _.clone(Market.DefaultEnv);

  // 市場環境関連の名前空間
  ObentoMarket.Env = {};

  // 天候情報を取得するURLを設定する。
  ObentoMarket.Env.weatherUrl = function(value)
  {
    Market.Env.weatherUrl = value;
    return ObentoMarket.Env;
  };

  // 市場ルールを設定する。
  ObentoMarket.Env.rule = function(value)
  {
    Market.Env.rule = (value == '1' || value == '2') ? value : '1';
    return ObentoMarket.Env;
  };

  // 市場の日数を設定する。
  ObentoMarket.Env.numOfDays = function(value)
  {
    Market.Env.numOfDays = (value >= 360) ? 360 : value;
    return ObentoMarket.Env;
  };

  // １日の最低お弁当仕入数を設定する。
  ObentoMarket.Env.minObentoPurchaseNum = function(value)
  {
    Market.Env.minObentoPurchaseNum = value;
    return ObentoMarket.Env;
  };

  // 市場環境をリセットする。
  ObentoMarket.Env.reset = function()
  {
    Market.Env = _.clone(Market.DefaultEnv);
    return ObentoMarket.Env;
  };

  ObentoMarket.Env._getEnv_ = function()
  {
    return Market.Env;
  };

  // お店の日毎の実績
  var DailyStoreActual = function(day, weather, store, activity)
  {
    this.initialize.apply(this, arguments);
  };

  // インスタンス・メソッド
  _.extend(DailyStoreActual.prototype, {

    initialize: function(day, weather, store, activity)
    {
      this.day = day;
      this.weather = weather;
      this.storeId = store.id;
      this.obentoId = activity.obentoId;
      this.purchaseNum = activity.purchaseNum;
      this.salesPrice = activity.salesPrice;
      this.capitalStock = store.capitalStock;
      this.cost = 0;
      this.sellNum = 0;
      this.gain = 0;
      this.message = '';
      this.hasError = false;
    },

    action: function()
    {
      try {
        this.update_(StoreManager.stores[this.storeId].activity(this.day));
        this.validate_();
      } catch (e) {
        this.hasError = true;
        this.message = e;
        throw e;
      }
    },

    update_: function(activity)
    {
      this.obentoId = activity.obentoId;
      this.purchaseNum = activity.purchaseNum || 10;
      if (activity.salesPrice != null) {
        this.salesPrice = Math.ceil(activity.salesPrice);
      } else {
        this.salesPrice = ((ObentoMarket.Obento[this.obentoId]) ? ObentoMarket.Obento[this.obentoId].defaultSalesPrice : null);
      }
    },

    // 当日のお店の活動内容に対し、次の検証を行う。
    // 1.正しいお弁当を指定しているか。
    // 2.
    // 3.資本金以上の購入をしていないか。
    // 4.最低限の仕入を行っているか。
    // 5.標準価格以上の販売価格を設定していないか。
    validate_: function()
    {
      var store = StoreManager.getById(this.storeId);
      // 1.
      var obento = ObentoMarket.Obento[this.obentoId];
      if (!obento) {
        throw '正しいお弁当を選択していません。';
      }

      // 2.
      if (this.purchaseNum != Math.ceil(this.purchaseNum)) {
        throw '仕入数の値が不正です。'
      }

      // 3.
      this.cost = obento.purchasePrice * this.purchaseNum;
      if (store.capitalStock < this.cost) {
        throw '資本金以上の仕入をしています。';
      }
      // 4.
//      if (store.capitalStock >= (Market.Env.minObentoPurchaseNum * obento.purchasePrice) &&
//        this.purchaseNum < Market.Env.minObentoPurchaseNum) {
      if (this.purchaseNum < Market.Env.minObentoPurchaseNum) {
        throw '最低仕入個数もしくはそれを下回る仕入をしています。';
      }
      // 5.
      this.salesPrice || (this.salesPrice = obento.defaultSalesPrice);
      if (this.salesPrice > obento.defaultSalesPrice) {
        throw '標準販売価格より高い価格を設定しています。';
      }
    },

    sell: function(sellNum)
    {
      this.sellNum = sellNum;
      this.gain = (this.salesPrice * this.sellNum) - this.cost;
      StoreManager.credit(this.storeId, this.gain);
      this.capitalStock += this.gain;
    },

    penalty: function()
    {
      //var obento = ObentoMarket.Obento[this.obentoId];
      //if (obento && this.capitalStock < obento.purchasePrice * Market.Env.minObentoPurchaseNum) {
      //  return;
      //}

      this.gain = Math.round(this.capitalStock * 0.3) * -1;
      StoreManager.credit(this.storeId, this.gain);
      this.capitalStock += this.gain;
    },

    attrs: function()
    {
      return {
        'storeId': this.storeId,
        'obentoId': this.obentoId,
        'purchaseNum': this.purchaseNum,
        'salesPrice': this.salesPrice,
        'capitalStock': this.capitalStock,
        'cost': this.cost,
        'sellNum': this.sellNum,
        'gain': this.gain,
        'message': this.message,
        'hasError': this.hasError
      };
    }
  });

  // クラス・メソッド
  _.extend(DailyStoreActual, {

    create: function(day, weather, storeId)
    {
      var store = StoreManager.stores[storeId];
      return new DailyStoreActual(day, weather, store, {
        obentoId: 'MATSU',
        purchaseNum: 10,
        salesPrice: ObentoMarket.Obento.MATSU.defaultSalesPrice
      });
    }
  });

  // 日毎の実績
  var DailyActual = function(day, weather)
  {
    this.initialize.apply(this, arguments)
  };

  // インスタンス・メソッド
  _.extend(DailyActual.prototype, {

    initialize: function(day, weather)
    {
      this.day = day;
      this.weather = weather;
      this.storeActuals = {};
    },

    addStoreActual: function(actual)
    {
      this.storeActuals[actual.storeId] = actual;
    },

    getSummaryByObento: function(obentoId)
    {
      var result = {
        obentoId: obentoId,
        totalPurchaseNum: 0,
        actuals: []
      };
      for (var storeId in StoreManager.stores) {
        if (!StoreManager.stores.hasOwnProperty(storeId)) continue;

        var actual = this.storeActuals[storeId];
        if (!actual.hasError && actual.obentoId == obentoId) {
          result.totalPurchaseNum += actual.purchaseNum;
          result.actuals.push(actual);
        }
      }
      return result;
    }
  });

  _.extend(DailyActual, {

    create: function(day, weather)
    {
      return new DailyActual(day, weather);
    }
  });

  // 市場１
  var MarketRule1 = {

    execute: function(dailyActual)
    {
      for (var i = 0; i < StoreManager.ids.length; i++) {
        var dsa = DailyStoreActual.create(dailyActual.day, dailyActual.weather, StoreManager.ids[i]);
        try {
          dsa.action();
          dsa.sell(Math.ceil(dsa.purchaseNum * ObentoMarket.Obento[dsa.obentoId].sellRate[dailyActual.weather]));
        } catch (e) {
          dsa.penalty();
        } finally {
          dailyActual.addStoreActual(dsa);
        }
      }
      return dailyActual;
    }
  };

  var MarketRule2 = {

    execute: function(dailyActual)
    {
      this.dailyActual = dailyActual;
      this.actionStores_();

      for (var obentoId in ObentoMarket.Obento) {
        if (!ObentoMarket.Obento.hasOwnProperty(obentoId)) continue;
        var obento = ObentoMarket.Obento[obentoId];
        this.calcWithObento_(obento);
      }
    },

    actionStores_: function()
    {
      for (var i = 0; i < StoreManager.ids.length; i++) {
        var dsa = DailyStoreActual.create(this.dailyActual.day, this.dailyActual.weather, StoreManager.ids[i]);
        try {
          dsa.action();
        } catch (e) {
          dsa.penalty();
        } finally {
          this.dailyActual.addStoreActual(dsa);
        }
      }
    },

    calcWithObento_: function(obento)
    {
      var sao = this.dailyActual.getSummaryByObento(obento.id);
      var totalSalesNum = Math.ceil(sao.totalPurchaseNum * obento.sellRate[this.dailyActual.weather]);
      var actuals = this.sortStoreActuals_(sao.actuals);

      var restSalesNum = totalSalesNum;
      for (var i = 0; i < actuals.length; i++) {
        var candidates = actuals[i];

        // 同価格帯での仕入れ数の計算
        var subtotalPurchaseNum = 0;
        for (var j = 0; j < candidates.length; j++) {
          var candidate = candidates[j];
          subtotalPurchaseNum += candidate.purchaseNum;
        }

        // 同価格帯での販売数と、１店舗あたりの販売数の算出
        var actualSalesNum = 0;
        if (restSalesNum > subtotalPurchaseNum) {
          actualSalesNum = subtotalPurchaseNum;
          restSalesNum -= actualSalesNum;
        } else {
          actualSalesNum = restSalesNum;
          restSalesNum = 0;
        }
        var actualSalesNumPerStore = Math.floor(actualSalesNum / candidates.length);

        // 店舗毎に販売数を設定
        for (var k = 0; k < candidates.length; k++) {
          candidate = candidates[k];
          candidate.sell(actualSalesNumPerStore);
        }
      }
    },

    sortStoreActuals_: function(actuals)
    {
      actuals.sort(function(a, b) {
        return (a.salesPrice == b.salesPrice) ?
          a.purchaseNum - b.purchaseNum : a.salesPrice - b.salesPrice;
      });

      var result = [];
      for (var i = 0; i < actuals.length; i++) {
        var actual = actuals[i];

        if (actual.hasError) {
          continue;
        }

        if (result.length ==0) {
          result.push([actual]);
          continue;
        }

        var t = _.last(result)
           ,u = _.last(t);
        if (u.salesPrice == actual.salesPrice && u.purchaseNum == actual.purchaseNum) {
          t.push(actual);
        } else {
          result.push([actual]);
        }
      }
      return result;
    }
  };

  // 天候取得
  function getWeather()
  {
    if (ObentoMarket.__.getWeather) {
      return ObentoMarket.__.getWeather();
    }

    var weather = [];
    $.ajax({
      'url': Market.Env.weatherUrl,
      'async': false,
      'type': 'GET',
      'data': {
        'd': Market.Env.numOfDays,
        't': 1
      }
    }).done(function(data) {
      weather = data.split(',');
    });
    return weather;
  }

  // ゲーム開始。
  ObentoMarket.start = function()
  {
    var rule = Market.Env.rule == '1' ? MarketRule1 : MarketRule2;
    var weather = getWeather();
    var currentDay = 0;

    Market.history = [];
    while (currentDay < Market.Env.numOfDays) {
      var dailyActual = DailyActual.create(currentDay + 1, weather[currentDay]);
      rule.execute(dailyActual);
      Market.history.push(dailyActual);
      currentDay++;
    }
  };

  ObentoMarket.reset = function()
  {
    ObentoMarket.Env.reset();
    StoreManager.clear();
  };

  /**
   * 前日までのお弁当の販売履歴を取得する。
   *
   * @example
   * var myStore = ObentoMarket.Store.entry('~', function(day, weather) {
   *   var history = ObentoMarket.getHistory();
   *   // 昨日の販売履歴を取得する。
   *   // hist -> {
   *   //   day: 1,
   *   //   weather: 0,
   *   //   activities: {
   *   //     'xxxx': {
   *   //       :
   *   //     },
   *   //     'yyyy': {
   *   //       :
   *   //     }
   *   //   }
   *   // }
   *   var hist = history[history.length - 1];
   *   // 昨日の日数を取得する。
   *   var yDay = hist.day;
   *   // 昨日の天気を取得する。
   *   var yWeather = hist.weather;
   *   // 昨日の自分のお店の販売実績を取得する。
  *   // actual -> {
   *   //   'storeId': 'xxxx',
   *   //   'capitalStock': 1017000,
   *   //   'obentoId': 'MATSU',
   *   //   'purchaseNum': 10,
   *   //   'cost': 15000,
   *   //   'salesPrice': 4000,
   *   //   'sellNum': 8,
   *   //   'gain': 17000
   *   // }
   *   var actual = hist.activities[myStore.id];

   * });
   * @returns {array<object>}
   */
  ObentoMarket.getHistory = function()
  {
    return Market.history;
  };


  return ObentoMarket;
}));
