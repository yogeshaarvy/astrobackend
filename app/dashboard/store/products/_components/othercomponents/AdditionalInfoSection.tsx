'use client';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import CustomDropdown from '@/utils/CusomDropdown';
import SimpleProductForm from './simpleproductsdrop';
import StockmanagmentProductForm from './stockmanagement';
import AttributesForm from './attributes';
import VariationsForm from './variations';

interface AdditionalInfoSectionProps {
  activeTab: string;
  tabsEnabled: {
    general: boolean;
    attribute: boolean;
    variations: boolean;
  };
  setActiveTab: (tab: string) => void;
  setTabsEnabled: React.Dispatch<
    React.SetStateAction<{
      general: boolean;
      attribute: boolean;
      variations: boolean;
    }>
  >;
  handleInputChange: any;
  handleDropdownChange: any;
  handleSaveAttributes: (
    newAttributes: { type: string; values: string[] }[]
  ) => void;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  activeTab,
  tabsEnabled,
  setActiveTab,
  setTabsEnabled,
  handleSaveAttributes,
  handleInputChange,
  handleDropdownChange
}) => {
  const form = useFormContext(); // Access form context
  const handleTabChange = (tab: string) => {
    if (tabsEnabled[tab]) {
      setActiveTab(tab);
    }
  };

  const handleSaveSettings = () => {
    const formData = form.getValues(); // Get current form data
    const productype = formData.productype; // Get the product type

    if (productype === 'simpleproduct') {
      const requiredFields = [
        'price',
        'special_price',
        'width',
        'height',
        'breadth',
        'length'
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
    }

    setTabsEnabled((prev) => ({
      ...prev,
      attribute: true,
      variations: true
    }));
    alert('Settings saved successfully!');
  };

  return (
    <div className="">
      <h4 className="py-2">Additional Info</h4>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => handleTabChange('general')}
          className={`border border-gray-900 px-4 py-2 text-sm font-medium ${
            activeTab === 'general'
              ? 'bg-gray-900 text-white'
              : 'bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white'
          }`}
        >
          General
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('attribute')}
          disabled={!tabsEnabled.attribute}
          className={`border border-gray-900 px-4 py-2 text-sm font-medium ${
            tabsEnabled.attribute
              ? activeTab === 'attribute'
                ? 'bg-gray-900 text-white'
                : 'bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white'
              : 'cursor-not-allowed bg-transparent text-gray-500'
          }`}
        >
          Attribute
        </button>
        {form.getValues('productype') === 'variableproduct' &&
          tabsEnabled.variations && (
            <button
              type="button"
              onClick={() => handleTabChange('variations')}
              disabled={!tabsEnabled.variations}
              className={`border border-gray-900 px-4 py-2 text-sm font-medium ${
                tabsEnabled.variations
                  ? activeTab === 'variations'
                    ? 'bg-gray-900 text-white'
                    : 'bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white'
                  : 'cursor-not-allowed bg-transparent text-gray-500'
              }`}
            >
              Variations
            </button>
          )}
      </div>
      {activeTab === 'general' && (
        <>
          <CustomDropdown
            control={form.control}
            label="Type of Product"
            name="productype"
            placeholder="Select product type"
            defaultValue="default"
            data={[
              { name: 'Simple Product', _id: 'simpleproduct' },
              { name: 'Variable Product', _id: 'variableproduct' }
            ]}
            value={form.getValues('productype')}
            onChange={(e) => form.setValue('productype', e.target.value)}
          />
          {form.getValues('productype') === 'simpleproduct' && (
            <SimpleProductForm
              handleInputChange={handleInputChange}
              handleDropdownChange={handleDropdownChange}
            />
          )}
          {(form.getValues('productype') === 'simpleproduct' ||
            form.getValues('productype') === 'variableproduct') && (
            <StockmanagmentProductForm
              handleInputChange={handleInputChange}
              handleDropdownChange={handleDropdownChange}
              producttype={form.getValues('productype')}
              disabled={false}
              productStockManagement={form.getValues('stockManagement')}
            />
          )}
          <Button
            type="button"
            onClick={handleSaveSettings}
            className="border-white-900 my-4 border bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 hover:text-white focus:z-10 focus:bg-blue-900 focus:text-white "
          >
            Save Settings
          </Button>
        </>
      )}
      {activeTab === 'attribute' && (
        <AttributesForm onSaveAttributes={handleSaveAttributes} />
      )}
      {activeTab === 'variations' && (
        <div className="mt-4">
          <VariationsForm
            newAttributes={attributes}
            handleInputChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdditionalInfoSection;
