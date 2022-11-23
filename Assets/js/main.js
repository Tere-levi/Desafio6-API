const clpInput = document.getElementById("clpInput");
const selectMonedas = document.getElementById("selectMonedas");
const form = document.getElementById("form");
const result = document.getElementById("result");
const chartDOM = document.getElementById("myChart")
let myChart


const getMonedas = async () => {
    try {

        const res = await fetch(`https://mindicador.cl/api/${selectMonedas.value}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error("Error en la peticion");
        }

        const valorMoneda = +data.serie[0].valor;

        const exchange = +(valorMoneda * clpInput.value).toFixed()

        result.textContent = `$ ${exchange.toLocaleString()}`

        return data;
    } catch (err) {
        result.textContent = err;
    }
}

const prepareChart = async (monedas) => {
    const ejeX = monedas.serie.map((item) => {
        return item.fecha.slice(0, 10);
    });
    const maxEjeX = ejeX.slice(0, 10);

    const ejeY = monedas.serie.map((item) => {
        return item.valor;
    });

    const maxEjeY = ejeY.slice(0, 10);

    const config = {
        type: "line",
        data: {
            labels: maxEjeX.reverse(),
            datasets: [
                {
                    label: `${selectMonedas.value}`,
                    backgroundColor: "blue",
                    data: maxEjeY.reverse(),
                },
            ],
        },
    };

    return config;
};

async function renderChart() {
    if (myChart) {
        myChart.destroy();
    }
    const monedas = await getMonedas();
    const config = await prepareChart(monedas);

    myChart = new Chart(chartDOM, config);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (clpInput.value == 0 || selectMonedas.value == "") {
        alert("Debes completar el formulario");
    } else {
        getMonedas();
        renderChart();
    }
});