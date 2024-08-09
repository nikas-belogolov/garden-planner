import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const layoutDataEntity = createEntityAdapter();

export const layoutDataSlice = createSlice({
    name: "layout",
    initialState: layoutDataEntity.setAll(layoutDataEntity.getInitialState(), []),
    reducers: {
        addNode(state, action) {
            if (Array.isArray(action.payload)) {
                layoutDataEntity.addMany(state, action.payload);
              return;
            }
            layoutDataEntity.addOne(state, action.payload);
        },
    }
})

const layoutDataReducer = layoutDataSlice.reducer;

export const layoutDataSelector = layoutDataEntity.getSelectors(
  (state: any) => state.currentLayoutData,
);
export const layoutDataAction = layoutDataSlice.actions;
export default layoutDataReducer;