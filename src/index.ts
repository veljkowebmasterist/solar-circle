import Chart from 'chart.js/auto';
import ChartDeferred from 'chartjs-plugin-deferred';

export interface FamilyEnergyData {
  familySize: string;
  eigennutzung: number;
  autarkie: number;
  gesamterzeugung: number;
  //string or number
  gesamtbedarf: string | number;

  module: number;
  preis: number;
}

export const familyEnergyData: FamilyEnergyData[] = [
  {
    familySize: 'Singlehaushalt',
    eigennutzung: 98, // Example value in percentage
    autarkie: 16, // Example value in percentage
    gesamterzeugung: 370, // Total production in kWp
    gesamtbedarf: 2500, // Total demand in kWh

    module: 1,
    preis: 1099,
  },
  {
    familySize: 'Kleinfamilie',
    eigennutzung: 96,
    autarkie: 27,
    gesamterzeugung: 925,
    gesamtbedarf: 3500,

    module: 2.5,
    preis: 2699,
  },
  {
    familySize: 'Grofamilie',
    eigennutzung: 84,
    autarkie: 34,
    gesamterzeugung: 1850,
    gesamtbedarf: 5000,
    module: 5,
    preis: 5199,
  },
];
window.Webflow ||= [];
window.Webflow.push(() => {
  // types for the data
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  //get individual values from the array based on what is selected in theradio button group named size reffering to family size

  function getSelectedRadioValue(groupName: string) {
    const radios = document.getElementsByName(groupName);
    for (const radio of radios) {
      if ((radio as HTMLInputElement).checked) {
        console.log((radio as HTMLInputElement).value);
        return (radio as HTMLInputElement).value;
      }
    }
    return null; // or undefined, or any default value you like
  }
  let size = getSelectedRadioValue('size') || 'Singlehaushalt';

  const sizeInputs = document.getElementsByName('size');

  let [familyEnergy] = familyEnergyData.filter(
    (data) => data.familySize === size
  ) as FamilyEnergyData[];

  console.log(familyEnergy);

  let { eigennutzung, autarkie, gesamterzeugung, gesamtbedarf } = familyEnergy as FamilyEnergyData;

  console.log(eigennutzung, autarkie, gesamterzeugung, gesamtbedarf);

  // find the text with the class autarkie and eignenutzung and update the text content with the values from the selected size
  document.querySelectorAll('.autarkie').forEach((element) => {
    element.textContent = autarkie.toString();
  });
  document.querySelectorAll('.eigennutzung').forEach((element) => {
    element.textContent = eigennutzung.toString();
  });

  const data = {
    labels: ['Bezug von SolarCircle', 'Bezug von Netz'],
    datasets: [
      {
        data: [autarkie, 100 - autarkie],
        backgroundColor: ['#079561', '#F0F4F2'],

        borderRadius: 70,
        spacing: 4,
        weight: 0.1,
      },
    ],
  };

  const config = {
    type: 'doughnut',
    data: data,
    plugins: [ChartDeferred],
    options: {
      hoverOffset: 4,
      animation: {
        duration: 1500,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
        interaction: {
          mode: 'nearest',
        },
        deferred: {
          xOffset: 150, // defer until 150px of the canvas width are inside the viewport
          yOffset: '50%',
          delay: 500, // delay of 500 ms after the canvas is considered inside the viewport
        },
      },
      cutout: '80%',
      responsive: true,
      aspectRatio: 1,
    },
  };

  const ctx = (document.getElementById('autarkie') as HTMLCanvasElement)?.getContext('2d');

  const myChart = new Chart(ctx, config);
  console.log(config);

  const dataEigennutzung = {
    labels: ['Bezug von SolarCircle', 'Bezug von Netz'],
    datasets: [
      {
        data: [eigennutzung, 100 - eigennutzung],
        backgroundColor: ['#079561', '#F0F4F2'],

        borderRadius: 70,
        spacing: 4,
        weight: 0.1,
      },
    ],
  };

  const configEigennutzung = {
    type: 'doughnut',
    data: dataEigennutzung,
    plugins: [ChartDeferred],
    options: {
      hoverOffset: 4,

      animation: {
        duration: 1500,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
        interaction: {
          mode: 'nearest',
        },
        deferred: {
          xOffset: 150, // defer until 150px of the canvas width are inside the viewport
          yOffset: '50%',
          delay: 500, // delay of 500 ms after the canvas is considered inside the viewport
        },
      },
      cutout: '80%',
      responsive: true,
      aspectRatio: 1,
    },
  };

  const ctxEigennutzung = (
    document.getElementById('Eigennutzung') as HTMLCanvasElement
  )?.getContext('2d');

  const myChartEigennutzung = new Chart(ctxEigennutzung, configEigennutzung);
  console.log(configEigennutzung);
  const dataBarChart = {
    labels: ['Gesamterzeugung', 'Gesamtbedarf'],
    datasets: [
      {
        data: [gesamterzeugung, gesamtbedarf], // Example values in kWh for Gesamterzeugung and Gesamtbedarf
        backgroundColor: ['#079561', '#F0F4F2'],
        barPercentage: 0.6,
        categoryPercentage: 1,
      },
    ],
  };

  const configBarChart = {
    //fix the scale on the x-axis so it doesnt adjust to the data
    //change the position of the labels on the y axis to be vertical

    type: 'bar',
    data: dataBarChart,
    options: {
      indexAxis: isMobile ? 'x' : 'y',
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },

      scales: {
        x: {
          stacked: false,
          grid: {
            display: false,
          },
          max: 5000,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Energie in kWh',
          },
        },
        y: {
          stacked: true,
          grid: {
            display: false,
          },
        },
      },
      animation: {
        duration: 1500,
      },
      responsive: true,
      aspectRatio: isMobile ? 1 : 2,
    },
  };

  const ctxBarChart = (document.getElementById('BarChart') as HTMLCanvasElement)?.getContext('2d');
  const myBarChart = new Chart(ctxBarChart, configBarChart);
  console.log(configBarChart);

  sizeInputs.forEach((sizeInput) => {
    sizeInput.addEventListener('change', () => {
      size = (sizeInput as HTMLInputElement).value;
      familyEnergy = familyEnergyData.find((data) => data.familySize === size) as FamilyEnergyData;
      ({ eigennutzung, autarkie, gesamterzeugung, gesamtbedarf } =
        familyEnergy as FamilyEnergyData);
      console.log(familyEnergy, eigennutzung, autarkie, gesamterzeugung, gesamtbedarf);

      myChart.data.datasets[0].data = [autarkie, 100 - autarkie];
      myChart.update();

      myChartEigennutzung.data.datasets[0].data = [eigennutzung, 100 - eigennutzung];
      myChartEigennutzung.update();

      myBarChart.data.datasets[0].data = [gesamterzeugung, gesamtbedarf];
      myBarChart.update();

      //find all the elements where the id starts with sommer- and winter- and remove the hide class if the part after the dash of the id matched the name of the selected size, and vice versa
      document.querySelectorAll('[id^=sommer-], [id^=winter-]').forEach((element) => {
        const id = element.id.split('-')[1];
        //force size to be written small case

        if (id === size.toLowerCase()) {
          element.classList.remove('hide');
        } else {
          element.classList.add('hide');
        }
      });
      // find the text with the class autarkie and eignenutzung and update the text content with the values from the selected size
      document.querySelectorAll('.autarkie').forEach((element) => {
        element.textContent = autarkie.toString();
      });
      document.querySelectorAll('.eigennutzung').forEach((element) => {
        element.textContent = eigennutzung.toString();
      });
    });
  });
});
