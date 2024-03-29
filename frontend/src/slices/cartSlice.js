import { createSlice } from '@reduxjs/toolkit'
import { addDecimals } from '../utils/cartUtils'

const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {cartItems: [], shippingAddress: {}, PaymentMethod: 'PayPal'}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload
            const existItem = state.cartItems.find((i) => i._id===item._id)
            if(existItem) {
                state.cartItems = state.cartItems.map((i) => i._id === existItem._id ? item : i)
            } else {
                state.cartItems = [...state.cartItems, item]
            }

            // Calculate items price
            state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price*item.qty, 0))
            // Calculate shipping price
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
            // Calculate tax price
            state.taxPrice = addDecimals(Number((0.15*state.itemsPrice).toFixed(2)))
            // Calculate total price
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) + 
                Number(state.taxPrice)
            ).toFixed(2)
            
            localStorage.setItem('cart', JSON.stringify(state))
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x => x._id !== action.payload))

            // Calculate items price
            state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price*item.qty, 0))
            // Calculate shipping price
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
            // Calculate tax price
            state.taxPrice = addDecimals(Number((0.15*state.itemsPrice).toFixed(2)))
            // Calculate total price
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) + 
                Number(state.taxPrice)
            ).toFixed(2)
            
            localStorage.setItem('cart', JSON.stringify(state))
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload

            // Calculate items price
            state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price*item.qty, 0))
            // Calculate shipping price
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
            // Calculate tax price
            state.taxPrice = addDecimals(Number((0.15*state.itemsPrice).toFixed(2)))
            // Calculate total price
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) + 
                Number(state.taxPrice)
            ).toFixed(2)
            
            localStorage.setItem('cart', JSON.stringify(state))
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            // Calculate items price
            state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price*item.qty, 0))
            // Calculate shipping price
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
            // Calculate tax price
            state.taxPrice = addDecimals(Number((0.15*state.itemsPrice).toFixed(2)))
            // Calculate total price
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) + 
                Number(state.taxPrice)
            ).toFixed(2)
            
            localStorage.setItem('cart', JSON.stringify(state))
        },
        clearCartItems: (state, action) => {
            state.cartItems = []
            // Calculate items price
            state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price*item.qty, 0))
            // Calculate shipping price
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
            // Calculate tax price
            state.taxPrice = addDecimals(Number((0.15*state.itemsPrice).toFixed(2)))
            // Calculate total price
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) + 
                Number(state.taxPrice)
            ).toFixed(2)
            
            localStorage.setItem('cart', JSON.stringify(state))
        }
    }
})

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions

export default cartSlice.reducer