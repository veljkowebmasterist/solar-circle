// eslint-disable-next-line simple-import-sort/imports
import { familyEnergyData, type FamilyEnergyData } from 'src/index.js';
console.log('Webflow loaded');
window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('Webflow loaded');
  // // find an element with id singlehaushalt and click it without scrolling to that part of the page
  // document.getElementById('singlehaushalt')?.click();

  //check the checkbox with id singlehaushalt
  const singlehaushaltCheckbox = document.getElementById('singlehaushalt') as HTMLInputElement;
  singlehaushaltCheckbox.checked = true;

  // grab the all radio buttons named size and filter them to see which one is checked

  const sizeInputs = document.getElementsByName('size');
  let size = 'Singlehaushalt';
  // set the values of the ui elements to the values of the familyEnergy object
  size = changeResults(size, sizeInputs[0]);
  for (const sizeInput of sizeInputs) {
    if ((sizeInput as HTMLInputElement).checked) {
      size = (sizeInput as HTMLInputElement).value;
      break;
    }
  }

  // add event listeners for size radio buttons that change the size variable based on the selected radio button
  for (const sizeInput of sizeInputs) {
    sizeInput.addEventListener('change', () => {
      size = changeResults(size, sizeInput);
    });
  }
});

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
  gesamterzeugungElement!.textContent = gesamterzeugung.toString();
  //get the module input element and replace the text with the value from the familyEnergy object
  const moduleElement = document.getElementById('module') as HTMLInputElement;
  moduleElement!.value = module.toString();
  //set the price to be 1099*the number of module, get the price element and set the text content to the price
  const price = 1099 * module;
  const priceElement = document.getElementById('price');
  priceElement!.textContent = price.toString();
  return size;
}
