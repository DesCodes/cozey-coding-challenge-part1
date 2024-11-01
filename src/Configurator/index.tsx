import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  SeatingWrapper,
  AddToCartButton,
  AddToCartContainer,
  ErrorMessage,
  Loader,
} from "./styles";
import axios from "axios";
import { Collection } from "../Common/Collection";
import { ConfigSelectionData, FetchDataResponse, handleconfig, SeatingConfigProps } from "./types";
import { useCartMutation } from "../hooks/useCartMutation";
import { calculateCozeyCarePrice } from "../helpers/calculateCozeyCarePrice";
import ColorSelector from "../Common/ColorSelector";
import React from "react";

export const SeatingConfigurator: React.FC<SeatingConfigProps> = ({
  collectionTitle,
  seating,
  config,
  price,
  colorsData,
  configId,
}) => {
  const router = useRouter();
  const [configSelected, setConfigSelected] = useState<ConfigSelectionData>(
    {} as ConfigSelectionData
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [additionalConfig, setAdditionalConfig] =
    useState<FetchDataResponse | null>(null);

  const { addToCart } = useCartMutation();

  useEffect(() => {
    const fetchAdditionalConfig = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get<FetchDataResponse>(`
          /api/configuration/${configId}
        `);
        setAdditionalConfig(response.data);
      } catch (error) {
        setErrorMessage("error, can't fetch");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdditionalConfig();
  }, [configId]);

  useEffect(() => {
    if (seating) {
      setConfigSelected({
        color: seating.option1OptionsCollection[0]?.value || "",
        seating: seating.sofa.option2OptionsCollection[0]?.value || "",
      });
    }
  }, [seating]);

  const handleConfig = ({ color, seating }: handleconfig) => {
    setConfigSelected((oldSelected) => ({
      ...oldSelected,
      color: color || oldSelected.color,
      seating: seating || oldSelected.seating,
    }));
  };

  const totalPrice = useMemo(() => {
    return price.value + calculateCozeyCarePrice(config.priceUsd);
  }, [price, config]);

  const handleAddToCart = () => {
    if (!configSelected.color || !configSelected.seating) {
      setErrorMessage("Please select both a color and a seating option");
      return;
    }
    setErrorMessage(null);

    addToCart({
      quantity: 1,
      variantId: configId,
      options: {
        color: configSelected.color,
        seating: configSelected.seating,
      },
    })
      .then(() => {
        router.push("/cart");
      })
      .catch(() => {
        setErrorMessage("Failed to add item to cart");
      });
  };

  return (
    <SeatingWrapper>
      {isLoading ? (
        <Loader>Loading configurations...</Loader>
      ) : additionalConfig ? (
        <>
          <ColorSelector
            selectedColor={configSelected.color}
            setColor={(color) =>
              handleConfig({
                color: color.value,
              })
            }
            colors={colorsData}
          />
          <div>
            <label>Select Seating Option</label>
            <select
              value={configSelected.seating?.value || ""}
              onChange={(e) =>
                handleConfig({ seating: e.target.value })
              }
            >
              {additionalConfig.seatingOptions.map((option) => (
                <div key={option.value}>
                  <option value={option.value}>{option.title}</option>
                </div>
              ))}
            </select>
          </div>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <AddToCartContainer>
            <AddToCartButton type="button" onClick={handleAddToCart}>
              Add to Cart - ${totalPrice}
            </AddToCartButton>
          </AddToCartContainer>
        </>
      ) : (
        <ErrorMessage>
          {errorMessage || "No configuration data available"}
        </ErrorMessage>
      )}
    </SeatingWrapper>
  );
};
