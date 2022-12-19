const criptomonedasSelect = document.querySelector("#criptomonedas");  //1
const monedasSelect = document.querySelector("#moneda"); 

const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
    moneda: "",
    criptomoneda: ""
};

document.addEventListener("DOMContentLoaded", async () => {   //2
    consultarCriptomonedas();
    const criptomonedas = await consultarCriptomonedas();
    selectCriptomonedas(criptomonedas.Data); 

    formulario.addEventListener("submit", submitFormulario);
    
    monedasSelect.addEventListener("change", leerValor);
    criptomonedasSelect.addEventListener("change", leerValor);
});

async function consultarCriptomonedas() {  //3
    try {
        const response = await fetch("https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD");
        return response.json();
    }catch(error) {
        console.log(error)
    }  
};

function selectCriptomonedas (criptomonedas) { //4
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option);
    });
};

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
};

function submitFormulario(e) {  //5
    e.preventDefault();
    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === "" || criptomoneda === "") {
        mostrarAlerta("AMBOS CAMPOS SON OBLIGATORIOS");
        return;
    }
    //Consultar la API con la informacion:
    consultaAPI();
};

function mostrarAlerta(msg) {  //6

    const msgError = document.querySelector(".error");

    if(!msgError) {
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("error");
        divMensaje.textContent = msg;
        formulario.appendChild(divMensaje); 

            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
    }
};    

function consultaAPI() { //7
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url).then(consulta => consulta.json())
    .then(cotizacion => {
        mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]);
    })
};

function mostrarCotizacion(cotizacion) {  //8

    limpiarHTML();

    const {moneda, criptomoneda} = objBusqueda;
    const {PRICE, HIGHDAY, LOWDAY,CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const price = document.createElement("p");
    price.classList.add("precio");
    price.innerHTML = `El precio del ${criptomoneda} es: <span>${PRICE}</span>`;

    const highDay = document.createElement("p");
    highDay.innerHTML = `El precio mas alto del dia: <span>${HIGHDAY}</span>`;

    const lowDay = document.createElement("p");
    lowDay.innerHTML = `El precio mas bajo del dia: <span>${LOWDAY}</span>`;
    
    const ChangePCT24Hour= document.createElement("p");
    ChangePCT24Hour.innerHTML = `Variación ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const lastUpdate = document.createElement("p");
    lastUpdate.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;
    

    resultado.appendChild(price);
    resultado.appendChild(highDay);
    resultado.appendChild(lowDay);
    resultado.appendChild(ChangePCT24Hour);
    resultado.appendChild(lastUpdate);

}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
};

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    spinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;
    resultado.appendChild(spinner);
}


//Otra forma con new promise:

// document.addEventListener("DOMContentLoaded" , () => {
//     consultarCriptomonedas();
// })

// function consultarCriptomonedas() {  //3
//     const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10& tsym=USD";
//     fetch(url)
//         .then(response => response.json())
//         .then(result => obtenerCriptomonedas(result.Data))
//         .then(criptomonedas => selectCriptomonedas(criptomonedas))
       
// };

// //Crear un Promise:  //4
// const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
//     resolve(criptomonedas);
// });

// function selectCriptomonedas (criptomonedas) {
//     criptomonedas.forEach(cripto => {
//         const {FullName, Name} = cripto.CoinInfo;

//         const option = document.createElement("option");
//         option.value = Name;
//         option.textContent = FullName;

//         criptomonedasSelect.appendChild(option);
//     });
// }