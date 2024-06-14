// eslint-disable-next-line simple-import-sort/imports
import { familyEnergyData, type FamilyEnergyData } from 'src/index.js';
window.Webflow ||= [];
window.Webflow.push(() => {
  const sizeInputs = document.getElementsByName('size');
  let size = 'Singlehaushalt';

  for (const sizeInput of sizeInputs) {
    if ((sizeInput as HTMLInputElement).checked) {
      size = (sizeInput as HTMLInputElement).value;
      changeResults(size, sizeInput);
      break;
    }
  }

  // set the values of the ui elements to the values of the familyEnergy object

  // add event listeners for size radio buttons that change the size variable based on the selected radio button
  for (const sizeInput of sizeInputs) {
    sizeInput.addEventListener('change', () => {
      for (const sizeInput of sizeInputs) {
        if ((sizeInput as HTMLInputElement).checked) {
          size = (sizeInput as HTMLInputElement).value;
          break;
        }
      }
      if (size === 'Gro') {
        calculateCustom();
      } else {
        changeResults(size, sizeInput);
      }
    });
  }
});

//create a event listener on module input that calls the calculateCustom function
document.getElementById('module')?.addEventListener('input', calculateCustom);

function calculateCustom() {
  const moduleWrapperElement = document.getElementById('module-wrapper');
  moduleWrapperElement?.classList.remove('hide');
  //select a module input element
  const moduleElement = document.getElementById('module') as HTMLInputElement;
  //get the input value and convert it to number and make sure its at least 1
  const module = Math.max(Number(moduleElement.value), 5);

  moduleWrapperElement?.classList.remove('hide');
  //calculate the price how it is but make sure if its 5 module that the price is 5199 const price = 1099 * Math.max(module, 5);
  const price = module <= 5 ? 5199 : 1099 * Math.max(Math.ceil(module), 5);

  const priceElement = document.getElementById('price');
  priceElement!.textContent = price.toString();
  //get gesamtleistung element and set the text content
  const gesamterzeugungElement = document.getElementById('gesamtleistung');
  gesamterzeugungElement!.textContent = (370 * Math.max(module, 5)).toString();
}

function changeResults(size: string, sizeInput: HTMLElement) {
  size = (sizeInput as HTMLInputElement).value;

  //filter the familyEnergyData array to get the object that matches the selected family size
  const [familyEnergy] = familyEnergyData.filter(
    (data) => data.familySize === size
  ) as FamilyEnergyData[];
  //destructure familyEnergy object to get the values
  const { gesamterzeugung, module } = familyEnergy as FamilyEnergyData;

  //get the fesamterzeugung element and replace the text with the value from the familyEnergy object
  const gesamterzeugungElement = document.getElementById('gesamtleistung');
  // if the size is Gro then set it to a custom string
  if (size === 'Gro') {
    gesamterzeugungElement!.textContent = '>5.000 kWh';
  } else gesamterzeugungElement!.textContent = gesamterzeugung.toString();

  //get the module input element and replace the text with the value from the familyEnergy object
  const moduleElement = document.getElementById('module') as HTMLInputElement;
  moduleElement!.value = module.toString();
  moduleElement!.textContent = module.toString();
  //set the price to be 1099*the number of module, get the price element and set the text content to the price with the module being min 5
  //add the hide class to the module input
  const moduleWrapperElement = document.getElementById('module-wrapper');
  moduleWrapperElement?.classList.add('hide');
  // moduleWrapperElement?.classList.add('hide');
  const price = familyEnergy.preis;
  const priceElement = document.getElementById('price');
  priceElement!.textContent = price.toString();
  return size;
}
