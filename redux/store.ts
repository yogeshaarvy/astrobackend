import { configureStore } from '@reduxjs/toolkit';

import settingReducer from './slices/settingsSlice';
import employeeReducer from './slices/employeeSlice';
import departmentReducer from './slices/departmentSlice';
import moduleReducer from './slices/moduleSlice';
import courseReducer from './slices/courseSlice';
import eventReducer from './slices/eventSlice';
import wallpaperReducer from './slices/wallpaperSlice';
import brandReducer from './slices/brandSlice';
import categoryReducer from './slices/store/categoriesSlice';
import tagsReducer from './slices/store/tagsSlice';
import productsReducer from './slices/store/productSlice';
import statesReducer from './slices/statesSlice';
import citiesReducer from './slices/citiesSlice';
import countriesReducer from './slices/countriesSlice';
import sellersReducer from './slices/sellersSlice';
import taxsReduser from './slices/taxsSlice';
import attributesSlice from './slices/attributesSlice';
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
import testimonialReducer from './slices/testimonial';
import blogsReducer from './slices/pages/bloges/categorySlice';
import promiseReducer from './slices/pages/promiseSlice';
import storeFaq from './slices/store/faqSlice';
import kundliFaq from './slices/kundli/faqSlice';
import kundliconfig from './slices/kundli/kundliSlice';
import configReducer from './slices/home/configSlice';
import storeConfigReducer from './slices/store/storeconfigSliceTest';
import storegallery from './slices/store/gallerySlice';
import filterReducer from './slices/store/filtersSlice';
import astroPoojaReducer from './slices/Configs/astroPoojaSlice';
import astropoojaListReducer from './slices/astropooja/list';
import astroPackageReducer from './slices/astropooja/package';
import horoscopeReducer from './slices/horoscope/horoscopeSlice';
import panchangConfigReducer from './slices/panchang/panchangSlice';
import horoscopetestimonialReducer from './slices/horoscope/testimonialSlice';
import panchangFaqReducer from './slices/panchang/faqSlice';
import blogConfigReducer from './slices/Configs/blogsSlice';
import whyChooseReducer from './slices/home/whyChooseSlice';
import ourServicesReducer from './slices/home/ourServices';
import consultanceReducer from './slices/home/consultance';
import horoscopeiconReducer from './slices/home/horoscope';
import horoscopedetailReducer from './slices/horoscope/horoscopeDetailSlice';
import registerImageReducer from './slices/register-imageSlice';
import calendarReducer from './slices/calendar';
import homeKundliReducer from './slices/home/kundli';
import homeVibhorReducer from './slices/home/vibhor';
import vibhorConfigReducer from './slices/Configs/vibhorConfigSlice';
import vibhorPackageReducer from './slices/vibhorPackageSlice';
import requestReducer from './slices/astrologer_requestsSlice';
import matchMakingReducer from './slices/matchmaking/config';
import matchMakingTestimonialReducer from './slices/matchmaking/testimonial';
import allordersReducer from './slices/store/allordersSlice';
import poojaOrdersReducer from './slices/astropooja/poojaorders';
import vibhorOrdersReducer from './slices/vibhor/ordersSlice';
import projectFaqReducer from './slices/projectFaqSlice';

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
      filter: filterReducer,
      productsdata: productsReducer,
      statesdata: statesReducer,
      Citiesdata: citiesReducer,
      countries: countriesReducer,
      sellers: sellersReducer,
      taxsdata: taxsReduser,
      attributesSlice: attributesSlice,
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
      requestsData: requestReducer,
      inventories: InventoryReducer,
      productfaq: productfaqReducer,
      allusers: allUsersReducer,
      shopPurpose: shopPurposeReducer,
      homeBanner: homeBannerReducer,
      testimonial: testimonialReducer,
      blogs: blogsReducer,
      promise: promiseReducer,
      configs: configReducer,
      storeconfigs: storeConfigReducer,
      storeListFaq: storeFaq,
      kundliListFaq: kundliFaq,
      kundliConfig: kundliconfig,
      galleryImage: storegallery,
      astroPoojas: astroPoojaReducer,
      astropoojaList: astropoojaListReducer,
      astroPackage: astroPackageReducer,
      horoscopeConfig: horoscopeReducer,
      panchangConfig: panchangConfigReducer,
      horoscopetestimonial: horoscopetestimonialReducer,
      panchangFaq: panchangFaqReducer,
      blogConfig: blogConfigReducer,
      whyChooseData: whyChooseReducer,
      ourService: ourServicesReducer,
      consultance: consultanceReducer,
      horoscope: horoscopeiconReducer,
      horoscopeDetail: horoscopedetailReducer,
      registerImage: registerImageReducer,
      calendar: calendarReducer,
      homeKundli: homeKundliReducer,
      homeVibhor: homeVibhorReducer,
      vibhorConfig: vibhorConfigReducer,
      vibhorPackage: vibhorPackageReducer,
      matchMaking: matchMakingReducer,
      matchMakingTestimonial: matchMakingTestimonialReducer,
      allorders: allordersReducer,
      allpoojsorders: poojaOrdersReducer,
      allvibhororders: vibhorOrdersReducer,
      projectfaq: projectFaqReducer
    }
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
