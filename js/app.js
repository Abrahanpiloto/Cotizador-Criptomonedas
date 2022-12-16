const criptomonedasSelect = document.querySelector("#criptomonedas"); //1

document.addEventListener("DOMContentLoaded", () => {   //2
    consultarCriptomonedas();
});

function consultarCriptomonedas() {  //3
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
    fetch(url)
        .then(response => response.json())
        .then(result => obtenerCriptomonedas(result.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
       
};

//Crear un Promise:  //4
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

function selectCriptomonedas (criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option);
    });
}