const { selection } = require("scenegraph")
let panel;

function create() {
    const HTML =
        `<style>
            .break {
                flex-wrap: wrap;
            }
            label.row > span {
                color: #8E8E8E;
                width: 20px;
                text-align: right;
                font-size: 9px;
            }
            label.row input {
                flex: 1 1 auto;
            }
            .show {
                display: block;
            }
            .hide {
                display: none;
            }
        </style>
        <form method="dialog" id="main">
            <div class="row break">
                <label class="row">
                    <span>↕︎</span>
                    <input type="text" uxp-quiet="true" id="search" placeholder="Search for appended tags" />
                </label>
            </div>
            <footer><button id="ok" type="submit" uxp-variant="cta">Apply</button></footer>
        </form>
        <div id="result">This plugin requires you to select the group of items in the document you want to make query of.</div>
        `
    panel = document.createElement("div");
    panel.innerHTML = HTML;

    return panel;
}

function show(event) {
    if (!panel) event.node.appendChild(create());
}

function update() {
    let form = document.querySelector("form");
    let result = document.querySelector("#result");
    let query = String(document.querySelector("#search").value);
    function searchFunction (){
        if (query && selection.items.length>1) {
            const arrToQuery = [];
            const elementNames = [];
            selection.items.forEach(node => {
                let searchResult = String(node.name);
                elementNames.push(searchResult);
                let appendedTag = searchResult.split(" ")[0];
                arrToQuery.push(appendedTag);
            })
            const resultToPrint = [];
            arrToQuery.forEach(item => {
                if(item === query){
                    resultToPrint.push(item);
                } 
            })
            const realNames = [];
            elementNames.forEach(name => {
                let temp = String(name.split(" ")[0]);
                for(let i=0;i<resultToPrint.length;i++){
                    if(resultToPrint[i] === temp){
                        realNames.push(name)
                    }
                }
            })
            const realResult = [...new Set(realNames)];
            const resultContent = [];
            if(realResult.length){
                realResult.forEach(item =>{
                    let itemsToShow = `<li>${item}</li>`;
                    resultContent.push(itemsToShow);
                })
            }
            if(resultContent.length){
                //console.log(resultContent)
                resultContent.forEach(item => {
                    result.insertAdjacentHTML('afterend', item);
                })
            }
            return result
        }
    }
    form.addEventListener("submit", searchFunction);
}


module.exports = {
    panels: {
        search: {
            show,
            update
        }
    }
};