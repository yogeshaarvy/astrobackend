import React from 'react';

interface AttributeData {
  [key: string]: string[]; // Keys represent attributes, values are arrays of possible options
}
// Example incoming data (can have any number of attributes)
const data: AttributeData = {
  color: ['Red', 'Blue'],
  size: ['Small', 'Medium', 'Large'],
  weight: ['Light', 'Heavy'],
  material: ['Plastic', 'Glass'],
  pattern: ['Striped', 'Solid'] // Add more attributes dynamically
};
const DynamicTable = () => {
  // Generate all combinations dynamically
  const generateCombinations = () => {
    const attributes = Object.keys(data); // Attribute names (e.g., sizes, weights, materials, etc.)
    const values = Object.values(data); // Array of attribute values

    // Recursive function to generate combinations
    const combine = (index: number, current: Record<string, string>) => {
      if (index === attributes.length) {
        return [current];
      }
      const key = attributes[index];
      const combinations: Record<string, string>[] = [];

      for (const value of values[index]) {
        combinations.push(...combine(index + 1, { ...current, [key]: value }));
      }
      return combinations;
    };

    return combine(0, {});
  };

  const combinations = generateCombinations();

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {Object.keys(data).map((attribute) => (
              <th scope="col" className="px-6 py-3" key={attribute}>
                {/* Dynamically create table headers based on attributes */}
                {attribute}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {combinations.map((combination, index) => (
            <tr
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              key={index}
            >
              {Object.keys(data).map((attribute) => (
                <td className="px-6 py-4" key={attribute}>
                  {combination[attribute]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
