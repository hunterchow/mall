/**
 * Created by Administrator on 2017/11/12.
 */
var express = require("express")
var router = express.Router();
var mongoose = require("mongoose");
var Goods = require("../models/goods");

//链接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on('connected', () => {
  console.log('mongoose connected.');
});
mongoose.connection.on('error', () => {
  console.log('mongoose connected fail.');
});
mongoose.connection.on('disconnected', () => {
  console.log('mongoose disconnected.');
});

//获取商品列表
router.get("/list", (req, res, next) => {
  var page = parseInt(req.param('page'));
  var pageSize = parseInt(req.param('pageSize'));
  var sort = parseInt(req.param('sort'));
  var skip = (page - 1) * pageSize;
  var priceLevel = req.param('priceLevel');
  var params = {};
  var priceGt = '', priceLte = '';
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 500;
        break;
      case '1':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '2':
        priceGt = 1000;
        priceLte = 2000;
        break;
      case '3':
        priceGt = 2000;
        priceLte = 5000;
        break;
    }
    params = {
      'salePrice': {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  } else {
    params = {}
  }
  var goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice': sort});

  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: "",
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});

//加入购物车
router.post("/addCart", (req, res, next) => {
  var userId = req.cookies.userId, productId = req.body.productId;
  var User = require('./../models/user');
  User.findOne({'userId': userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (userDoc) {
        var productItem = '';
        userDoc.cartList.forEach((item) => {
          if (item.productId === productId) {
            productItem = item;
            item.productNum++;
          }
        });
        if (productItem) {
          userDoc.save((err3, doc3) => {
            if (err3) {
              res.json({
                status: '1',
                msg: err3.message
              });
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'success'
              });
            }
          });
        } else {
          Goods.findOne({'productId': productId},(err1, doc) => {
            if (err1) {
              res.json({
                status: '1',
                msg: err.message
              });
            } else {
              if (doc) {
                doc.productNum = 1;
                doc.checked = '1';
                userDoc.cartList.push(doc);
                userDoc.save((err2, doc2) => {
                  if (err2) {
                    res.json({
                      status: '1',
                      msg: err2.message
                    });
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'success'
                    });
                  }
                });
              }
            }
          });
        }
      }
    }
  });
});

module.exports = router;

