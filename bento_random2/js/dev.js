
var CSVCreator = {
};

CSVCreator.createCSV = function(storeId)
{
    var histories = ObentoMarket.getHistory();
    var holder = [];
    holder.push(['日数', 'お店ID', '仕入弁当', '仕入数', '仕入金額', '販売個数', '販売価格', '売上', '利益', '資金']);
    for (var i = 0; i < histories.length;  i++) {
        var hist = histories[i];
        var actual = hist.storeActuals[storeId];
        holder.push([
            hist.day,
            storeId,
            actual.obentoId,
            actual.purchaseNum,
            actual.cost,
            actual.sellNum,
            actual.salesPrice,
            actual.salesPrice * actual.sellNum,
            actual.gain,
            actual.capitalStock
        ]);
    }
    return holder;
};

CSVCreator.out = function(holder)
{
  var o = $('#result-csv');
  var text = '';
  for (var i = 0; i < holder.length; i++) {
    var row = holder[i];
    text += row.join(',') + '\n';
  }
  o.text(text);
};

CSVCreator.create = function(storeId)
{
    var holder = this.createCSV(storeId);
    this.out(holder);
};

var tpl = {};

var ResultTable = {
};

ResultTable.setupTemplates = function()
{
    tpl.store_cell = _.template($('#tpl_store_cell').text());
    tpl.date_info_cell = _.template($('#tpl_date_info_cell').text());
    tpl.date_actual_cell = _.template($('#tpl_date_actual_cell').text());
};

ResultTable.createHeader = function(rowEl)
{
    rowEl.appendChild($('<td>&nbsp;</td>')[0]);

    var storeIds = ObentoMarket.Store.getIds();
    for (var i = 0; i < storeIds.length; i++) {
        var store = ObentoMarket.Store.getById(storeIds[i]);
        rowEl.appendChild($(tpl.store_cell({
            'storeId': store.id,
            'storeName': store.name
        }))[0])
    }
};

var weatherLabel = ['晴','曇', '雨', '嵐'];
var weatherColor = ['#A9F5A9', '#D8D8D8', '#81BEF7', '#F5A9A9'];
ResultTable.createDateInfoCell = function(rowEl, hist)
{
    rowEl.appendChild($(tpl.date_info_cell({
        'day': hist.day + '日目',
        'weather': weatherLabel[hist.weather],

        'attrs': {
            'weatherColor': weatherColor[hist.weather]
        }

    }))[0]);
};

ResultTable.createDateActualCell = function(rowEl, hist)
{
    var activities = hist.storeActuals;
    var storeIds = ObentoMarket.Store.getIds();

    for (var i = 0; i < storeIds.length; i++) {
        var actual = activities[storeIds[i]];
        var obento = ObentoMarket.Obento[actual.obentoId];
        rowEl.appendChild($(tpl.date_actual_cell({
            'productName': obento ? obento.dispName : actual.obentoId,
            'sellNum': actual.sellNum,
            'purchaseNum': actual.purchaseNum,
            'cost': actual.cost,
            'sales': actual.salesPrice * actual.sellNum,
            'capitalStock': actual.capitalStock,
            'gain': actual.gain,
            'hasError': actual.hasError,
            'message': actual.message,
            'attrs': {
                'gainColor': (actual.gain < 0) ? 'red' : 'blue'
            }

        }))[0]);
    }
};

ResultTable.show = function()
{
    var $resultTable = $('#result-table');

    var blank = document.createDocumentFragment();
    this.createHeader(blank);
    $resultTable.append($('<tr>').append(blank));

    var histories = ObentoMarket.getHistory();
    for (var i = 0; i < histories.length; i++) {
        var hist = histories[i];
        blank = document.createDocumentFragment();
        this.createDateInfoCell(blank, hist);
        this.createDateActualCell(blank, hist);
        $resultTable.append($('<tr>').append(blank));
    }
};

function startGame()
{
    ObentoMarket.Env.numOfDays(360).weatherUrl('http://wkij-obento.herokuapp.com/api/weather');
    ObentoMarket.start();
    ResultTable.show();
}

function resetGame()
{
    window.location.reload();
}

function setupEvents()
{
    $('#start-btn').click(startGame);
    $('#reset-btn').click(resetGame);
}

function showBanner()
{
    console.log(" __          __  _                            _          ____  ____   _____   _ \n" +
                " \\ \\        / / | |                          | |        |  _ \\|  _ \\ / ____| | |\n" +
                "  \\ \\  /\\  / /__| | ___ ___  _ __ ___   ___  | |_ ___   | |_) | |_) | |      | |\n" +
                "   \\ \\/  \\/ / _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\ | __/ _ \\  |  _ <|  _ <| |      | |\n" +
                "    \\  /\\  /  __/ | (_| (_) | | | | | |  __/ | || (_) | | |_) | |_) | |____  |_|\n" +
                "     \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___|  \\__\\___/  |____/|____/ \\_____| (_)\n" +
                "\n" +
                "http://wkij-obento.herokuapp.com/\n" +
                "http://wkij-obento.herokuapp.com/reference/dev_guide.html\n" +
                "\n" +
                "=== Debug情報 ===\n" +
                "お弁当の種類を見たいとき:\tObentoMarket.Obento\n" +
                "天候の種類を見たいとき:\tObentoMarket.Weather\n" +
                "お店の情報を知りたいとき:\tObentoMarket.Store\n" +
                "                     1)\tObentoMarket.Store.getIds();\n" +
                "                     2)\tObentoMarket.Store.getById();\n" +
                "過去の履歴を知りたいとき:\tObentoMarket.getHistory();\n" +
                "\n"
    );
}

$(function() {
    setupEvents();
    ResultTable.setupTemplates();
    showBanner();
});