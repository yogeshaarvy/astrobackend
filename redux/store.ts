import { configureStore } from '@reduxjs/toolkit';

import settingReducer from './slices/settingsSlice';
import employeeReducer from './slices/employeeSlice';
import departmentReducer from './slices/departmentSlice';
import moduleReducer from './slices/moduleSlice';
import courseReducer from './slices/courseSlice';
import eventReducer from './slices/eventSlice';
import wallpaperReducer from './slices/wallpaperSlice';
import brandReducer from './slices/brandSlice';
import categoryReducer from './slices/categoriesSlice';
import tagsReducer from './slices/tagsSlice';
import filtertypesReducer from './slices/typesSlice';
import filtervaluesReducer from './slices/valuesSlice';
import productsReducer from './slices/productSlice';
import statesReducer from './slices/statesSlice';
import citiesReducer from './slices/citiesSlice';
import countriesReducer from './slices/countriesSlice';
import sellersReducer from './slices/sellersSlice';
import taxsReduser from './slices/taxsSlice';
import attributesSlice from './slices/attributesSlice';
import terms_conditionsReducer from './slices/terms_conditionsSlice';
import privacy_policyReducer from './slices/privacy_policySlice';
import return_policyReducer from './slices/return_policySlice';
import shipping_policyReducer from './slices/shipping_policySlice';
import salesReducer from './slices/salesSlice';
import midbannerReducer from './slices/midbanner';
import sliderReducer from './slices/slidersSlice';
import aboutustopbannerReducer from './slices/aboutus_topbannerSlice';
import faqReducer from './slices/faqSlice';
import homeaboutlistReducer from './slices/homeaboutlistSlice';
import homeCategoriesReducer from './slices/homeCategoriesSlice';
import newArrivalsReducer from './slices/newArrivalsSlice';
import homeFooterReducer from './slices/homeFooterSlice';
import aboutusVisionReducer from './slices/aboutus_visionSlice';
import blogsBannerReducer from './slices/blogsbannerSlice';
import blogsPostReducer from './slices/blogspostSlice';
import newsletterReducer from './slices/newsletterSlice';
import promoCodesReducer from './slices/promocodeSlice';
import InventoryReducer from './slices/inventoriesSlice';
import productfaqReducer from './slices/productFaqSlice';
import allUsersReducer from './slices/allusersSlice';
import shopPurposeReducer from './slices/shopPurposeSlice';
import astroAboutReducer from './slices/homeaboutSlice';
import homeBannerReducer from './slices/home/banner';

export const makeStore = () => {
  return configureStore({
    reducer: {
      settings: settingReducer,
      employee: employeeReducer,
      department: departmentReducer,
      module: moduleReducer,
      course: courseReducer,
      event: eventReducer,
      wallpaper: wallpaperReducer,
      brand: brandReducer,
      category: categoryReducer,
      tags: tagsReducer,
      filtertypes: filtertypesReducer,
      filtervalues: filtervaluesReducer,
      productsdata: productsReducer,
      statesdata: statesReducer,
      Citiesdata: citiesReducer,
      countries: countriesReducer,
      sellers: sellersReducer,
      taxsdata: taxsReduser,
      attributesSlice: attributesSlice,
      terms_conditions: terms_conditionsReducer,
      privacy_policy: privacy_policyReducer,
      return_policy: return_policyReducer,
      shipping_policy: shipping_policyReducer,
      sales: salesReducer,
      midbanner: midbannerReducer,
      slider: sliderReducer,
      astroAbout: astroAboutReducer,
      about: aboutustopbannerReducer,
      faq: faqReducer,
      homeaboutlist: homeaboutlistReducer,
      homeCategories: homeCategoriesReducer,
      newArrivals: newArrivalsReducer,
      homeFooter: homeFooterReducer,
      aboutusVision: aboutusVisionReducer,
      blogsBanner: blogsBannerReducer,
      blogsPost: blogsPostReducer,
      newsletter: newsletterReducer,
      promoCodesdata: promoCodesReducer,
      inventories: InventoryReducer,
      productfaq: productfaqReducer,
      allusers: allUsersReducer,
      shopPurpose: shopPurposeReducer,
      homeBanner: homeBannerReducer
    }
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
