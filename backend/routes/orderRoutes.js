import express from 'express'
const router = express.Router()
import asyncHandler from '../middleware/asyncHandler.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import Order from '../models/orderModel.js'

// @desc Create new Order
// @route POST /api/orders
// @access Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { 
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
     } = req.body
     if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order Items')
     } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x, product: x._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
     }
}))

// @desc Get logged in user order
// @route GET /api/orders/myorders
// @access Private
router.get('/myorders', protect, asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.status(200).json(orders)
}))

// @desc Get order by id
// @route GET /api/orders/:id
// @access Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if(order) {
        res.status(200).json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
}))

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if(order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: '6604fca1f2c3c9b6db2b34b6',
            status: 'approved',
            update_time: Date.now(),
            email_address: req.body.user.email_address
        }
        const updatedOrder = await order.save()
        res.status(200).json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
}))

// @desc Update to delivered
// @route PUT /api/orders/:id/deliver
// @access Private/Admin
router.put('/:id/deliver', protect, admin, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if(order) {
        order.isDelivered = true
        order.isDeliveredAt = Date.now()
        const updatedOrder = await order.save()
        res.status(200).json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
}))

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.status(200).json(orders)
}))

export default router