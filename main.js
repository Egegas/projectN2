var datacoinToReort = [[],[],[],[],[]];
var coinsToreport = [];
var coinsSymbolReport = [];
var datareportconfig = [
    {
        type: "spline",
        name: "",
        showInLegend: true,
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "#,##0",
        dataPoints: datacoinToReort[0]
},
    {
        type: "spline",
        name: "",
        axisYType: "secondary",
        showInLegend: true,
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "$#,##0.#",
        dataPoints: datacoinToReort[1]
},
    {
        type: "spline",
        name: "",
        showInLegend: true,
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "#,##0",
        dataPoints: datacoinToReort[2]
    },
    {
        type: "spline",
        name: "",
        showInLegend: true,
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "#,##0",
        dataPoints: datacoinToReort[3]
    },
    {
        type: "spline",
        name: "",
        axisYType: "secondary",
        showInLegend: true,
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "$#,##0.#",
        dataPoints: datacoinToReort[4]
    }

];
var reportTitle="";
var datainterval;

appInit()

function appInit(){
    $(`#home a`).removeClass(`btn btn-light`).addClass(`btn btn-primary`);
    $('#body-container').append(`<div class="col-12 text-center"><img class="loader m-auto col-4" src="images/loader.gif" alt=""></img></div>`); 
    getAllCoins().then(allCoinsRes => allCoinsHtml(allCoinsRes));   
}
function homeInit() {
    $(`#home a`).removeClass(`btn btn-light`).addClass(`btn btn-primary`);
    $(`#reports a`).removeClass().addClass(`btn btn-light`);
    $(`#about a`).removeClass().addClass(`btn btn-light`);
    $(`#body-container`).html("");
    clearInterval(datainterval);

    getAllCoins().then(allCoinsRes => allCoinsHtml(allCoinsRes));
}
function reporteInit() {
    $(`#reports a`).removeClass(`btn btn-light`).addClass(`btn btn-primary`);
    $(`#home a`).removeClass().addClass(`btn btn-light`);
    $(`#about a`).removeClass().addClass(`btn btn-light`);
    $(`#body-container`).html("");
    datacoinToReort[0].length=0;;
    datacoinToReort[1].length=0;
    datacoinToReort[2].length=0;
    datacoinToReort[3].length=0;
    datacoinToReort[4].length=0;
    datareportconfig[0].name="";
    datareportconfig[1].name="";
    datareportconfig[2].name="";
    datareportconfig[3].name="";
    datareportconfig[4].name="";
    reportTitle="";

    fetch('templates/report.html').then(res => res.text().then(htmlRes => reportRender(htmlRes)));
        getReportData().then(reporData => reportDataInit(reporData));
   datainterval =  setInterval(getdata, 3000);

}
function aboutInit() {
    $(`#about a`).removeClass(`btn btn-light`).addClass(`btn btn-primary`);
    $(`#reports a`).removeClass().addClass(`btn btn-light`);
    $(`#home a`).removeClass().addClass(`btn btn-light`);
    $(`#body-container`).html("");
    fetch('templates/about.html').then(res => res.text().then(htmlRes => aboutRender(htmlRes)));


}

function getAllCoins() {
    return fetch("https://api.coingecko.com/api/v3/coins/list").then(res => res.json());
}

function allCoinsHtml(allcoins) {
    fetch('templates/coinCard.html').then(res => res.text().then(htmlRes => renderCoinCard(htmlRes, allcoins)));
}

function renderCoinCard(htmlRes, allcoins) {
    console.log(htmlRes);
    console.log(allcoins);
    let allCoinsHtml = ""

    for (let i = 0; i < allcoins.length; i++) {
        let html = htmlRes;
        html = html.replace(/{coin-id}/g, allcoins[i].id);
        html = html.replace("{coin-symbol}", allcoins[i].symbol.toUpperCase());
        html = html.replace("{coin-name}", allcoins[i].name);
        allCoinsHtml += html
    }
    if($('.loader')){
        $('.loader').fadeOut("slow");  
    }
    $('#body-container').attr("style","display:none")
    $('#body-container').append(allCoinsHtml);
    $('#body-container').fadeIn("slow")

    toggleSelected();
}

function getCoinMoreInfo(coinId) {
    var moreInfoRecord = JSON.parse(window.localStorage.getItem(coinId)) || [];

    if (moreInfoRecord.time != undefined) {
        var currentTime = new Date()
        var dif = (currentTime - new Date(moreInfoRecord.time));
        var dif = Math.round((dif / 1000) / 60);
        if (dif <= 2) {
           // $(`#collapse${coinId}`).collapse('show');render
           fetch('templates/moreInfo.html').then(res => res.text().then(htmlRes => renderMoreInfoexist(htmlRes,  moreInfoRecord, coinId))); 
        }
        else {
            fetch('templates/progressBar.html').then(res => res.text().then(htmlRes => renderProgressBar(htmlRes, coinId)));
            getMoreinfo(coinId).then(moreInfoRes => moreInfoHtml(moreInfoRes, coinId));
        }
    }
    else {
        fetch('templates/progressBar.html').then(res => res.text().then(htmlRes => renderProgressBar(htmlRes, coinId)));
        getMoreinfo(coinId).then(moreInfoRes => moreInfoHtml(moreInfoRes, coinId));
    }
}

function getMoreinfo(coinId) {
    return fetch("https://api.coingecko.com/api/v3/coins/" + coinId).then(res => res.json());
}

function moreInfoHtml(moreinfo, coinId) {
    let moreinforecord = { "image": moreinfo.image.small, "usd": moreinfo.market_data.current_price.usd, "eur": moreinfo.market_data.current_price.eur, "ils": moreinfo.market_data.current_price.ils, "time": new Date() }
    console.log(moreinfo);
    console.log(coinId);
    console.log(moreinforecord)
    localStorage.setItem(coinId, JSON.stringify(moreinforecord))
    fetch('templates/moreInfo.html').then(res => res.text().then(htmlRes => renderMoreInfo(htmlRes, moreinfo, coinId)));
}

function renderMoreInfo(htmlRes, moreinfo, coinId) {
    console.log(moreinfo);
    console.log(coinId);
    console.log(htmlRes);
    $(`#${coinId} .more-info`).html("");
    htmlRes = htmlRes.replace("{imageurl}", moreinfo.image.small);
    htmlRes = htmlRes.replace("{usd}", moreinfo.market_data.current_price.usd);
    htmlRes = htmlRes.replace("{eur}", moreinfo.market_data.current_price.eur);
    htmlRes = htmlRes.replace("{ils}", moreinfo.market_data.current_price.ils);
    $(`#${coinId} .more-info`).html("");
    $(`#${coinId} .more-info`).append(htmlRes);

}

function renderMoreInfoexist(htmlRes, moreinfo, coinId) {
    console.log(moreinfo);
    console.log(coinId);
    console.log(htmlRes);
    $(`#${coinId} .more-info`).html("");
    htmlRes = htmlRes.replace("{imageurl}", moreinfo.image);
    htmlRes = htmlRes.replace("{usd}", moreinfo.usd);
    htmlRes = htmlRes.replace("{eur}", moreinfo.eur);
    htmlRes = htmlRes.replace("{ils}", moreinfo.ils);
    $(`#${coinId} .more-info`).append(htmlRes);

}

function renderProgressBar(progressBarHtml, coinId) {
    $(`#${coinId} .more-info`).append(progressBarHtml);
    $(function () {
        var current_progress = 0;
        var interval = setInterval(function () {
            current_progress += 10;
            $("#dynamic")
                .css("width", current_progress + "%")
                .attr("aria-valuenow", current_progress)
                .text(current_progress + "% Complete");
            if (current_progress >= 100)
                clearInterval(interval);
        }, 300);
    });
}

function coinReport(coinId, e) {
    if (e.checked == true) {
        coinsToreport.push(coinId);
        coinsSymbolReport.push($(`#${coinId} .card-title`).text());
    }
    else {
        coinsToreport = coinsToreport.filter(value => value !== coinId);
        coinsSymbolReport = coinsSymbolReport.filter(value => value !== $(`#${coinId} .card-title`).text());
        $(`#${coinId} input`).prop("checked", false);
        $('#coinsselectedmodal').modal('hide');
        setTimeout(() => {
            $('div#coinsselectedmodal').remove()
        }, 300);
    }
    if (coinsToreport.length == 6) {
        getModalHtml();
    }
}

function getModalHtml() {
    fetch('templates/modal.html').then(res => res.text().then(htmlRes => rendermodal(htmlRes)));
}

function rendermodal(modalHtml) {

    for (let i = 0; i < coinsToreport.length; i++) {
        modalHtml = modalHtml.replace(`{name-coin-${i}}`, $(`#${coinsToreport[i]} .card-title`).text());
        modalHtml = modalHtml.replace(`{coin-id-selected-${i}}`, coinsToreport[i]);
    }
    $('#body-container').append(modalHtml)
    $('#coinsselectedmodal').modal('show')
}

function coinReportDelete(coinId) {
    coinsToreport = coinsToreport.filter(value => value !== coinId);
    coinsSymbolReport = coinsSymbolReport.filter(value => value !== $(`#${coinId} .card-title`).text());
    $(`#${coinId} input`).prop("checked", false);
    $('#coinsselectedmodal').modal('hide');
    setTimeout(() => {
        $('div#coinsselectedmodal').remove()
    }, 300);

}

function coinSearch() {
        // $(`.card-title:not(:contains(${$('#searchinput').val()}))`).parent().parent().hide()
    if ($('#searchinput').val() != ""){
            let cardscoin = $(`.card-title`);
    for (let i = 0; i < cardscoin.length; i++) {
        if (cardscoin[i].textContent != $('#searchinput').val()) {

            $(cardscoin[i].parentNode.parentNode).hide()
            $('#search').addClass('d-none');
            $('#clrsearch').removeClass('d-none')
        }
    }
    $('#searchinput').val("")
    }
    else{
        alert("no value in search input")
    }



}

function coinSearchclr(){
    $('.card.col-xl-4.col-md-4.col-sm-12').removeAttr('style');
    $('#clrsearch').addClass('d-none');
    $('#search').removeClass('d-none')

}

function reportRender(htmlRes) {
    $('#body-container').append(htmlRes);
    window.options = {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: reportTitle
        },
        subtitles: [{
            text: ""
        }],
        axisX: {
            title: "",
            valueFormatString: "HH:mm:ss"
        },
        axisY: {
            title: "Coin Value",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        toolTip: {
            shared: true,
            content: "{name}: {y}$"
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: datareportconfig
    };
    $("#chartContainer").CanvasJSChart(options);

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

}

function getReportData() {
    return fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsSymbolReport.toString()}&tsyms=USD`).then(res => res.json());
}

function getdata(){
    getReportData().then(reporData => reportDataInit(reporData));
}

function reportDataInit(reporData) {
options.title.text = `${ coinsSymbolReport.toString()} to usd`;
    console.log(reporData);
    for (let i = 0; i < Object.keys(reporData).length; i++) {
        datareportconfig[i].name = Object.keys(reporData)[i];

       datacoinToReort[i].push({ x: new Date(), y:  reporData[Object.keys(reporData)[i]].USD });

    }
    $("#chartContainer").CanvasJSChart().render()
   
    
}

function toggleSelected(){
for (let i = 0; i < coinsToreport.length; i++) {
    $(`#${coinsToreport[i]} input`).prop("checked", true);
}

}

function aboutRender(htmlRes) {
let proyectText = `In this project you need to develop a single page that accesses information and reports from the world of virtual commerce.
                  The world of virtual trading has become very popular in recent years, however a variety of API’S have been created that provide free information (usually in a one-time registration) about the state of the currencies, price, history, sale and buy and more.
                  The app you are going to build here is a client side app only that contains calls to various API’s.
                  All information is stored solely on the customer side, there is no information required to store in the backend & Database.`;

let aboutMySelf = `My name is Ezequiel Eizner, 39 years old. Born in Argentina and now a Jerusalemite
                   Married to Saray and father of Lavi.
                   Works at the Bank of Israel as a software deloveper.
                   I received my training in the field from my job at Bezeq, where I worked for about 10 years. For the past 4 years, i worked at the Bank in the field of SharePoint
                   recently taking a full-stack course yt Jhon-Brice to get more skills and a necesary diploma in the field
`

    htmlRes = htmlRes.replace("{image-url}", "images/me.jpg");
    htmlRes = htmlRes.replace("{about-me-text}", aboutMySelf);
    htmlRes = htmlRes.replace(" {proyect-text}", proyectText);
    $('#body-container').append(htmlRes);

}