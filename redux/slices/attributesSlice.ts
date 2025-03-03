import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Attribute {
  types: any;
  values: string[];
}

interface AttributesState {
  data: Attribute[];
}

const initialState: AttributesState = {
  data: []
};

const attributesSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    saveAttributes(state, action: PayloadAction<Attribute[]>) {
      state.data = action.payload;
    },
    loadAttributes(state) {
      // This can be used to load attributes from a persistent store if needed
    }
  }
});

export const { saveAttributes, loadAttributes } = attributesSlice.actions;

export const selectAttributes = (state: any) => state.attributes.data;

export default attributesSlice.reducer;
