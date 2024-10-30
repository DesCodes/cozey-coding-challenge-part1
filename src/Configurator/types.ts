export interface ConfigSelectionData {
  color?: string;
  seating?: string;
}

export interface handleconfig {
  color?: string;
  seating?: string;
}

export interface FetchDataResponse {
  seatingOptions: { value: string; title: string }[];
}

interface SeatingOptions {
  value: string;
}

interface SeatingSelection {
  option1OptionsCollection: SeatingOptions[]; //Array of colour or seating options for option1
  sofa: {
    option2OptionsCollection: SeatingOptions[]; //Array of options for option2 in sofa
  }
}

interface Configuration {
  priceUsd: number;
}

interface Price {
  value: number;
}

interface Colors {
  value: string;
  title: string;
}

export interface SeatingConfigProps {
  collectionTitle: string;
  seating: SeatingSelection; //seating is an object type containing arrays or nested objects
  config: Configuration;    //keep as object in case we add other currencies
  price: Price;             //keep as an object in case there are more variables like compareAtPrice
  colorsData: Colors[];     //array of colour objects from ColorSelector.tsx
  configId: string;         //keep as a string since the ID doesn't need to be used in a calculation
}