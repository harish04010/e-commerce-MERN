import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetOrderDetailsQuery, usePayOrderMutation, useDeliverOrderMutation } from '../slices/orderApiSlice'

import React from 'react'

const OrderScreen = () => {
  const { id: orderId } = useParams()

  const { data: order, refetch, isLoading } = useGetOrderDetailsQuery(orderId)
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation()
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation()

  const { userInfo } = useSelector((state) => state.auth)

  const onApproveTest = async () => {
    try {
      const details = order
      const updatedOrder = await payOrder({ orderId, details })
      if(updatedOrder) {
        refetch()
      }
      toast.success('Payment Successful')
    } catch (err) {
      toast.error(err?.data?.Message || err.message)
    }
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId)
      refetch()
      toast.success('Order Delivered')
    } catch (err) {
      toast.error(err?.data?.Message || err.message)
    }
  } 

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}  
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}, {' '}. {order.shippingAddress.postalCode}, {' '} {order.shippingAddress.country}
              </p>
              { order.isDelivered ? (
                <Message variant='success'>Delivered on { order.deliveredAt }</Message>
              ) : (<Message variant='danger'>Not Delivered</Message>)}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              { order.isPaid ? (
                <Message variant='success'>Pain on { order.paidAt }</Message>
              ) : (<Message variant='danger'>Not Paid</Message>)}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay ? <Loader /> : (
                    <Button style={{ marginBottom: '10px' }} onClick={onApproveTest} >
                        Pay Order
                    </Button>
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>
                    Mark as Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>11
    </>
  )
}

export default OrderScreen