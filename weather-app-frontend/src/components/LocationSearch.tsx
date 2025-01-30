import { useState, useEffect, useRef } from "react";
import { gql, useLazyQuery } from "@apollo/client";

const GET_LOCATION_SUGGESTIONS = gql`
  query GetLocationSuggestions($input: String!) {
    getLocationSuggestions(input: $input) {
      description
      placeId
    }
  }
`;

const GET_LOCATION_DETAILS = gql`
  query GetLocationDetails($placeId: String!) {
    getLocationDetails(placeId: $placeId) {
      lat
      lon
      address
    }
  }
`;

interface LocationSearchProps {
  setLocation: (value: { name: string; lat: number; lon: number }) => void;
  handleSearch: (lat: number, lon: number, name: string) => void;
}

export function LocationSearch({
  setLocation,
  handleSearch,
}: LocationSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<
    { name: string; placeId: string }[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const isManualSelection = useRef(false);

  const [fetchLocations, { data }] = useLazyQuery(GET_LOCATION_SUGGESTIONS, {
    fetchPolicy: "network-only",
  });

  const [fetchLocationDetails, { data: locationData }] = useLazyQuery(
    GET_LOCATION_DETAILS,
    {
      fetchPolicy: "network-only",
    }
  );

  // Fetch location suggestions with debouncing
  useEffect(() => {
    if (isManualSelection.current) {
      isManualSelection.current = false;
      return;
    }

    if (inputValue.length > 2) {
      fetchLocations({ variables: { input: inputValue } });
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [inputValue, fetchLocations]);

  // Update suggestions when data arrives
  useEffect(() => {
    if (data?.getLocationSuggestions) {
      setSuggestions(
        data.getLocationSuggestions.map(
          (item: { description: string; placeId: string }) => ({
            name: item.description,
            placeId: item.placeId,
          })
        )
      );
      setShowDropdown(true);
      setSelectedIndex(-1);
    }
  }, [data]);

  // Update lat/lon when location details arrive
  useEffect(() => {
    if (locationData?.getLocationDetails) {
      const { lat, lon, address } = locationData.getLocationDetails;
      setLocation({ name: address, lat, lon });
      handleSearch(lat, lon, address);
    }
  }, [locationData]);

  // Handle dropdown selection
  const handleSelect = (index: number) => {
    const selected = suggestions[index];
    if (selected) {
      isManualSelection.current = true;
      setInputValue(selected.name);
      setShowDropdown(false);
      fetchLocationDetails({ variables: { placeId: selected.placeId } });
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            setSelectedIndex((prev) =>
              Math.min(prev + 1, suggestions.length - 1)
            );
            event.preventDefault();
          }
          if (event.key === "ArrowUp") {
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
            event.preventDefault();
          }
          if (event.key === "Enter" && selectedIndex >= 0) {
            handleSelect(selectedIndex);
          }
        }}
        placeholder="Enter location"
        style={{ wordBreak: "break-word", whiteSpace: "normal" }}
        className="w-full text-xl sm:text-2xl md:text-2xl lg:text-4xl font-bold border-0 border-b border-gray-300 py-1 focus:outline-none focus:ring-0 focus:border-black"
      />
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto rounded-md"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-4 py-2 cursor-pointer ${
                index === selectedIndex ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onMouseDown={() => handleSelect(index)}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
