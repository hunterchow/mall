/**
 * Created by Administrator on 2017/11/16.
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  'userId': String,
  'userName': String,
  'userPwd': String,
  'orderList': [{
    'orderStatus': String,
    'orderId': String,
    'goodsList': [{
      'productId': String,
      'productName': String,
      'salePrice': Number,
      'productImage': String,
      'productNum': Number,
      'checked': String
    }],
    'orderTotal': Number,
    'addressInfo': {
      'addressId': String,
      'isDefault': Boolean,
      'postCode': String,
      'streetName': String,
      'tel': String,
      'userName': String
    },
    'createDate': String
  }],
  'cartList': [{
    'productId': String,
    'productName': String,
    'salePrice': Number,
    'productImage': String,
    'productNum': Number,
    'checked': String
  }],
  'addressList': [{
    'addressId': String,
    'isDefault': Boolean,
    'postCode': String,
    'streetName': String,
    'tel': String,
    'userName': String
  }]
});

module.exports = mongoose.model('User', userSchema);
