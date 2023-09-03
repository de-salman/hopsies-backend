const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productControllers')
const router = express.Router()

router.route('/product').get(getAllProducts)
router.route('/product/new').post(createProduct)
router.route('/product/:id').put(updateProduct)
router.route('/product/:id').delete(deleteProduct)





module.exports = router