const reihen = [["/","leer"],["Achi","achi"],["Frei","frei"],["Aui","aui"],["Gset","gset"]];
const list = [["1","1"],["2","2"],["3","3"],["4","4"],["5","5"],["6","6"],
                ["Zwischensumme","zs"],["Bonus","bs"],["Total oben","to"],
                ["Max","max"],["Min","min"],["Differenz","dif"],
                ["Kenter","ke"],["Full","fu"],["Poker","po"],["60er","60"],
                ["Total Reihe","tu"],["Gesamtsumme","gsu"]];
const reihenfolge = ["1","2","3","4","5","6","max","min","ke","fu","po","60"]

// creates gameValues and returns to DOM
function init()
{
    const gameValues = {
        "gameCode": "thisIsARandomName",
        "currentPlayerID": 0,
        "player": [
            {
                "playerID": 0,
                "name": "Manuel",
                "nextRollOK":true,
                "nrRoll": 0,
                "round":0,
                "angesagt":false,
                "gesagterWurf":0,
                "letzterWurf":[],
                "wurfel": [
                    {"augenzahl": 1, "hold": false}, // dice 1-6
                    {"augenzahl": 2, "hold": false}, 
                    {"augenzahl": 3, "hold": false},
                    {"augenzahl": 4, "hold": false},
                    {"augenzahl": 5, "hold": false},
                ]
            },
            {
                "playerID": 1,
                "name": "Markus",
                "nextRollOK":true,
                "nrRoll": 0,
                "round":0,
                "angesagt":false,
                "gesagterWurf":0,
                "letzterWurf":[],
                "wurfel": [
                    {"augenzahl": 1, "hold": false}, // dice 1-6
                    {"augenzahl": 1, "hold": false},
                    {"augenzahl": 1, "hold": false},
                    {"augenzahl": 1, "hold": false},
                    {"augenzahl": 1, "hold": false},
                ]
            }
        ]
    }
    $("#namePlayer1").text(gameValues.player[0].name);
    $("#namePlayer2").text(gameValues.player[1].name);
    return gameValues;
}

// provides link to the pictures needed to display
function bilder(x)
{
    switch(x)
    {
        case 1:
            return "one.png";
        case 2:
            return "two.png";
        case 3:
            return "three.png";
        case 4:
            return "four.png";
        case 5:
            return "five.png";
        case 6:
            return "six.png";
    }
}

// adds dice dictionary to DOM
function getWuerfelIDs()
{
    let wuerfelIDs = {"wuerfelEins":1,"wuerfelZwei":2,"wuerfelDrei":3,"wuerfelVier":4,"wuerfelFuenf":5};
    return wuerfelIDs;
}

//creates tables for each team/player with uniqe id's
function createTable()
{
    document.write("<tr>")
    reihen.forEach((x) => document.write("<th>"+x[0]+"</th>"));
    document.write("</tr>")
    list.forEach((x) => document.write("<tr><td id=text-"+x[0]+" class=locked>"+x[0]+"</td>"+
                "<td id=achi-"+x[1]+" class=unlocked></td>"+
                "<td id=frei-"+x[1]+" class=unlocked></td>"+
                "<td id=aui-"+x[1]+" class=unlocked></td>"+
                "<td id=gset-"+x[1]+" class=unlocked></td></tr>"))
}

// who's turn is it
function getCurrentPlayer()
{
    return gameValues.currentPlayerID
}

// new set of 5 dice
function newRoll()
{
    let playerID = getCurrentPlayer();
    {
        for(let i=0; i<5; i++)
        {
            gameValues.player[playerID].letzterWurf = [];
            let newWuerfel = parseInt(Math.random() * 6 + 1);
            gameValues.player[playerID].wurfel[i].augenzahl = newWuerfel;
            assignNewPic(i, newWuerfel);
        }
    };
}

// roll all dice without class "hold"
function rollUnholdDice()
{
    let playerID = getCurrentPlayer();
    gameValues.player[playerID].letzterWurf = []
    gameValues.player[playerID].wurfel.forEach(x=>gameValues.player[playerID].letzterWurf.push(x.augenzahl));
    if(gameValues.player[playerID].round!=47){
        if (gameValues.player[playerID].nrRoll < 2){
            (gameValues.player[playerID].wurfel).forEach((a,i) => {
                if(a.hold == false)
                {
                    a.augenzahl = parseInt(Math.random() * 6 + 1);
                    assignNewPic(i,a.augenzahl);
                }
            });
            console.log("Roll Nummer "+ (gameValues.player[playerID].nrRoll+2))
            gameValues.player[playerID].nrRoll += 1;
            applyGameValuesToUi();
        }
        else (alert("du kannst nicht mehr würfeln"));
    }
    else{
        if (gameValues.player[playerID].nrRoll < 4){
            (gameValues.player[playerID].wurfel).forEach((a,i) => {
                if(a.hold == false)
                {
                    a.augenzahl = parseInt(Math.random() * 6 + 1);
                    assignNewPic(i,a.augenzahl);
                }
            });
            console.log("Roll Nummer "+ (gameValues.player[playerID].nrRoll+2))
            gameValues.player[playerID].nrRoll += 1;
            applyGameValuesToUi();
        }
        else (alert("spielende"));
    }
}
// changes player, resets counter and passes on to next player
function nextPlayer()
{
    let playerID = getCurrentPlayer();
    gameValues.player[playerID].wurfel.forEach(x => x.hold=false)
    applyGameValuesToUi(1)
    gameValues.player[playerID].nrRoll = 0;
    // switchCurrentPlayer();
    newRoll();
}

// is called if a new assignment of picture is needed
function assignNewPic(i, x)
{
    const counters = ["Eins", "Zwei", "Drei", "Vier", "Fuenf", "Sechs"];
    $("#wuerfel" + counters[i]).attr("src", bilder(x));
}

// registers a listener to the document - needed for each click on a dice; checks, if current player is allowed to click
function registerHoldListener()
{
    $("div img").click(function(event)
    {
        let playerID = getCurrentPlayer();
        let imgID = event.target.id;
        gameValues.player[playerID].wurfel[wuerfelIDs[imgID]-1].hold = !gameValues.player[playerID].wurfel[wuerfelIDs[imgID]-1].hold;
        applyGameValuesToUi(1);
    });
}

// is called when player clicks on dice, adds new class to the dice, changes class of dice to "hold" or removes it
function applyGameValuesToUi(x)
{
    let playerID = getCurrentPlayer();
    for(let i=0;i<5;i++)
    {
        if(x==1)    
        {
            let thisWuerfelHoldBool = gameValues.player[playerID].wurfel[i].hold;
            if(thisWuerfelHoldBool){$($("div img")[i]).addClass("hold");}
            else if(thisWuerfelHoldBool == false){$($("div img")[i]).removeClass("hold");}
        }
    }
}

// registers a listener for the buttons and fires events
function registerButtonListerner()
{
    $("#knopf1").click(function(){rollUnholdDice()});
    $("#knopf2").click(function(){said()});
}

// switches current player after round 
function switchCurrentPlayer()
{
    gameValues.currentPlayerID = gameValues.currentPlayerID==0 ? 1 : 0;
}

//listens on events when clicking the table
function tableClickListener()
{
    let playerID = getCurrentPlayer();
    // console.log(playerID);
    $("#punkteTabelle"+playerID).click(function(event)
    {
        let cellID = event.target.id;
        computePoints(cellID);
    });
}

//computing points after click on table
function computePoints(x)
{
    let clickedArray = x.split("-")
    let row = clickedArray[0]
    let field = clickedArray[1];
    let playerID = getCurrentPlayer();
    let diceSet = []; 
    gameValues.player[playerID].wurfel.forEach(x=>diceSet.push(x.augenzahl))
    diceSet = diceSet.sort();
    console.log(diceSet);
    console.log(clickedArray);
    
    let validator = legit(row,field)
    let validatePoker = legitPoker(field,diceSet)

    if(validator&&validatePoker){
        if($("#"+x).attr("class")=="unlocked"){

            // zahlen
            if(field==1||field==2||field==3||field==4||field==5||field==6){  
                let counter = 0;
                diceSet.forEach(x => {if(x==field){counter+=1}});
                let sum = counter * field;
                $("#"+x).text(sum);
            }

            // min max
            else if(field=="max"||field=="min"){ 
                let sum = diceSet.reduce((part, a)=> part + a, 0);
                $("#"+x).text(sum);
            }

            // kenter
            else if(field=="ke"){
                let kenterTestArrayOrigin = diceSet;
                let validator = true;
                for(let i=0;i<5;i++){
                    let s = kenterTestArrayOrigin.pop();
                    kenterTestArrayOrigin.forEach(x=>{
                        if(x==s){validator = false;}
                        else{validator = true;};
                    })
                    if (!validator){break;}
                }
                if(validator){
                    $("#"+x).text("35");
                }
                else {$("#"+x).text("0");}
            }

            // full
            else if(field=="fu"){
                let fullTestDiceSet = diceSet;
                let fullTestMap = {}

                fullTestDiceSet.forEach(x=>
                    (fullTestMap[x] == null ? (fullTestMap[x]=1) : (fullTestMap[x]+=1))
                )
                let count = 0;
                let validator = null;
                for(let key in fullTestMap){++count;}
                if(count==2 || count==1){
                    for(let key in fullTestMap){
                        if(fullTestMap[key]==2 || fullTestMap[key]==3 || fullTestMap[key]==5){
                            validator = true;
                            break;
                        }
                        else {
                            validator = false;
                        }
                    }
                }
                let sum = 40;
                let add = 0;
                if (validator){
                    for(let key in fullTestMap){
                        if(fullTestMap[key]==3 || fullTestMap[key]==5){
                            add = key * 3
                        } 
                    }
                    sum = sum + add;
                    $("#"+x).text(sum);
                }
                else {$("#"+x).text("0");}
            }

            //poker
            else if(field=="po"){
                let pokerTestDiceSet = diceSet;
                let pokerTestMap = {};

                pokerTestDiceSet.forEach(x=>
                    (pokerTestMap[x] == null ? (pokerTestMap[x]=1) : (pokerTestMap[x]+=1))
                )
                let count = 0;
                let validator = null;
                for(let key in pokerTestMap){++count;}
                if(count==2 || count==1){
                    for(let key in pokerTestMap){
                        if(pokerTestMap[key]==4||pokerTestMap[key]==5){
                            validator = true;
                            break;
                        }
                        else {
                            validator = false;
                        }
                    }
                }
                let sum = 50;
                let add = 0;
                if (validator){
                    for(let key in pokerTestMap){
                        if(pokerTestMap[key]==4){
                            add = key * 4
                        } 
                    }
                    sum = sum + add;
                    $("#"+x).text(sum);
                }
                else {$("#"+x).text("0");
                }
            }

            // 60er
            else if(field==60){
                let sixtyTestDiceSet = diceSet;
                let sixtyTestMap = {};

                sixtyTestDiceSet.forEach(x=>
                    (sixtyTestMap[x] == null ? (sixtyTestMap[x]=1) : (sixtyTestMap[x]+=1))
                )
                let count = 0;
                let validator = null;
                for(let key in sixtyTestMap){++count;}
                if(count==1){
                    validator = true;
                }
                else{
                    validator = false;
                }
                let sum = 60;
                let add = 0;
                if (validator){
                    for(let key in sixtyTestMap){
                            add = key * 5
                        } 
                    sum = sum + add;
                    $("#"+x).text(sum);
                    }
                else {$("#"+x).text("0");}
            }
            caluclateTotals(clickedArray, x)
        }
    }
}

//calculates totals after writing points
function caluclateTotals(clickedArray, x)
{
    let row = clickedArray[0]
    let field = clickedArray[1];
    let upperSum = parseInt(0);
    let upperTotal = 0;
    let diffSum = 0;
    let lowerSum = 0;
    let lowerTotal = 0;
    let playerID = getCurrentPlayer();
    
    // lock selected / clicked field
    $("#"+x).addClass("locked").removeClass("unlocked");

    //upper part
    for(let i=1;i<=7;i++){
        let s = $("#"+row+"-"+i).text()
        if(s==""){ // ||s==null||s==undefined)
            s=0
        }
        upperSum += parseInt(s);
    }
    $("#"+row+"-zs").text(upperSum);

    //bonus + upper total
    if(upperSum>=60){
        $("#"+row+"-bs").text(30);
        upperTotal = upperSum+30;
        $("#"+row+"-to").text(upperTotal);
    }
    else{
        upperTotal = upperSum; 
        $("#"+row+"-bs").text(0);
        $("#"+row+"-to").text(upperSum);
    }

    //min + max
    let max = $("#"+row+"-max").text();
    let min = $("#"+row+"-min").text();
    let one = $("#"+row+"-1").text();
    if(max!="" && min!="" && one!=""){
        diffSum = (max-min)*one;
        if(diffSum<0){
            $("#"+row+"-dif").text(0);
        }
        else{
            $("#"+row+"-dif").text(diffSum);
        }
    }

    //total row sum
    let u = $("#"+row+"-to").text()=="" ? 0 : Number($("#"+row+"-to").text());
    let d = $("#"+row+"-dif").text()=="" ? 0 : Number($("#"+row+"-dif").text());
    let k = $("#"+row+"-ke").text()=="" ? 0 : Number($("#"+row+"-ke").text());
    let f = $("#"+row+"-fu").text()=="" ? 0 : Number($("#"+row+"-fu").text());
    let p = $("#"+row+"-po").text()=="" ? 0 : Number($("#"+row+"-po").text());
    let s = $("#"+row+"-60").text()=="" ? 0 : Number($("#"+row+"-60").text());
    lowerSum = u+d+k+f+p+s;
    $("#"+row+"-tu").text(lowerSum)

    // total over all
    let ac = $("#achi-tu").text()=="" ? 0 : Number($("#achi-tu").text());
    let fr = $("#frei-tu").text()=="" ? 0 : Number($("#frei-tu").text());
    let au = $("#aui-tu").text()=="" ? 0 : Number($("#aui-tu").text());
    let gs = $("#gset-tu").text()=="" ? 0 : Number($("#gset-tu").text());
    lowerTotal = ac+fr+au+gs;
    $("#gset-gsu").text(lowerTotal)

    gameValues.player[playerID].angesagt = false;
    gameValues.player[playerID].round += 1;
    // next player
    nextPlayer();
}

// check if the selected option is valid or player has to choose another row
function legit(row,field)
{
    let playerID = getCurrentPlayer();

    if(row=="achi"&&gameValues.player[playerID].angesagt==false){
        if(field!="1"){
            let i = reihenfolge.indexOf(field)
            console.log(reihenfolge[i])
            console.log(reihenfolge[i-1])
            if($("#achi-"+reihenfolge[i-1]).text()==""){
                alert("da darfst du noch nicht schreiben")
                return false
            }
            else{return true}
        }
        else{return true}
    }

    else if(row=="aui"&&gameValues.player[playerID].angesagt==false){
        if(field!="60"){
            let i = reihenfolge.indexOf(field)
            console.log(reihenfolge[i])
            console.log(reihenfolge[i+1])
            if($("#aui-"+reihenfolge[i+1]).text()==""){
                alert("da darfst du noch nicht schreiben")
                return false
            }
            else{return true}
        }
        else{return true}

    }

    else if(row=="gset"&&gameValues.player[playerID].angesagt==false){
        let playerID = getCurrentPlayer();
        let rgw = gameValues.player[playerID].nrRoll==0 ? true : false
        if(!rgw){alert("nach dem ersten wurf darfst du nicht mehr in diese reihe schreiben")}
        return rgw
    }

    else if(row=="gset"&&gameValues.player[playerID].angesagt){
        let playerID = getCurrentPlayer();
        if(field!=gameValues.player[playerID].gesagterWurf){
            alert("Du hast " + gameValues.player[playerID].gesagterWurf + " angesagt.")
            return false;
        }
        else {return true}
    }

    else if(row=="frei"&&gameValues.player[playerID].angesagt==false){
        return true;
    }
    else {return false};
}

function legitPoker(field,diceSet)
{
    if(field=="po"){
        console.log("im baum");
        let playerID = getCurrentPlayer();
        let l = gameValues.player[playerID].letzterWurf.sort();
        let d = diceSet;
        let l1 = l.slice(0,4);
        let l2 = l.slice(1,5);
        let d1 = d.slice(0,4);
        let d2 = d.slice(1,5);
        console.log(l1,l1,d1,d2);
        const equals = (a,b) => JSON.stringify(a) === JSON.stringify(b);
        if(equals(l1,d1) || equals(l1,d2) || equals(l2,d1) || equals(l2,d2)){
            alert("du darfst diesen poker nicht mehr schreiben")
            return false;
        }
        else{return true}   
    }
    else{return true};
}

// activates mode "angesagt"
function said()
{
    let playerID = getCurrentPlayer();
    if(gameValues.player[playerID].nrRoll==0){
        let rausda = true;
        while(rausda){
            let ags = prompt("Was gset?, 1,2,3,4,5,6,max,min,ke,fu,po,60")
            for(let i=0;i<reihenfolge.length;i++){
                if(reihenfolge[i]==ags){
                    rausda = false;
                    gameValues.player[playerID].gesagterWurf = ags;
                    break;
                }
            }        
        };
        if($("#gset-"+gameValues.player[playerID].gesagterWurf).text()==""){
            gameValues.player[playerID].angesagt = true
            console.log("angesagt modus AKTIV")
        }
        else if($("#gset-"+ags).text()!=NaN){
            console.log("angesagt modus NICHT MÖGLICH")
        }
    else{alert("das geht nur beim ersten wurf")}
    }
}