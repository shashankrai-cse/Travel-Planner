import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1, // 1: Dates & Travelers, 2: Hotel Select, 3: Add-ons, 4: Review, 5: Payment
  selectedPackage: null,
  selectedHotel: null,
  selectedRoomType: null,
  startDate: null,
  endDate: null,
  travelers: [{ name: '', age: 18 }],
  addOns: [],
  priceBreakdown: {
    base: 0,
    hotel: 0,
    addOns: 0,
    taxes: 0,
    total: 0,
  },
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setBookingPackage: (state, action) => {
      state.selectedPackage = action.payload;
      state.priceBreakdown.base = action.payload?.basePrice || 0;
      state.priceBreakdown.total = state.priceBreakdown.base + state.priceBreakdown.hotel + state.priceBreakdown.addOns + state.priceBreakdown.taxes;
    },
    setDates: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setTravelers: (state, action) => {
      state.travelers = action.payload;
    },
    setHotelSelection: (state, action) => {
      state.selectedHotel = action.payload.hotel;
      state.selectedRoomType = action.payload.roomType;
      state.priceBreakdown.hotel = action.payload.pricePerNight * (action.payload.nights || 1);
      state.priceBreakdown.total = state.priceBreakdown.base + state.priceBreakdown.hotel + state.priceBreakdown.addOns + state.priceBreakdown.taxes;
    },
    toggleAddOn: (state, action) => {
      const addOn = action.payload;
      const index = state.addOns.findIndex((item) => item.name === addOn.name);
      if (index >= 0) {
        state.addOns.splice(index, 1);
      } else {
        state.addOns.push(addOn);
      }
      state.priceBreakdown.addOns = state.addOns.reduce((acc, cur) => acc + cur.price, 0);
      state.priceBreakdown.total = state.priceBreakdown.base + state.priceBreakdown.hotel + state.priceBreakdown.addOns + state.priceBreakdown.taxes;
    },
    resetBooking: () => initialState,
  },
});

export const {
  setStep,
  setBookingPackage,
  setDates,
  setTravelers,
  setHotelSelection,
  toggleAddOn,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
