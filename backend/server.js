import path from 'path'
import express from "express"
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import connectDB from './config/db.js'
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

const port = process.env.PORT || 5000;

connectDB()

const app = express()

// Body parser middleware -- Tosend body in post methods
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parser middleware -- Allows to access request.cookies to access the JWT
app.use(cookieParser())


app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

if(process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    console.log('here')
    // anyroute that is not api will be redirected to index.html
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => {
        res.send("API is running...")
    })
}


app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`API running on port ${port}`))