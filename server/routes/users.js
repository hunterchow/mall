var express = require('express');
var router = express.Router();
var User = require('./../models/user');
require('./../Util/util');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//登录接口
router.post('/login', (req, res, next) => {
  var param = {
    'userName': req.body.userName,
    'userPwd': req.body.userPwd
  };
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        });
      }else{
        res.json({
          status: '',
          msg: '帐号或密码错误！',
          result: ''
        });
      }
    }
  });
});

//登出接口
router.post('/logout', (req, res, next) => {
  res.cookie('userId', "", {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: ''
  });
});

//校验接口
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});

//购物车接口
router.get('/cartList', (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({'userId': userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        });
      }
    }
  });
});

//购物车删除接口
router.post('/cartDel', (req, res, next) => {
  var userId = req.cookies.userId, productId = req.body.productId;
  User.update({'userId': userId}, {$pull: {'cartList': {'productId': productId}}}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      });
    }
  });
});

//购物车编辑接口
router.post('/cartEdit', (req, res, next) => {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({'userId': userId, 'cartList.productId': productId},
    {
      'cartList.$.productNum': productNum,
      'cartList.$.checked': checked
    }, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: '0',
          msg: '',
          result: 'success'
        });
      }
    });
});

//购物车全选接口
router.post('/cartSelectAll', (req, res, next) => {
  var userId = req.cookies.userId, selectAll = req.body.selectAll ? '1' : '0';
  User.findOne({userId: userId}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = selectAll;
        });
        user.save((err1, doc) => {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
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
});

//查询用户地址列表接口
router.get('/address', (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({'userId': userId}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        res.json({
          status: '0',
          msg: '',
          result: user.addressList
        });
      }
    }
  });
});

//设置默认地址接口
router.post('/setDefault', (req, res, next) => {
  var userId = req.cookies.userId, addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'addressId is null!',
      result: ''
    });
  }
  User.findOne({'userId': userId}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user) {
        var addressList = user.addressList;
        addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        });

        user.save((err1, doc) => {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
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
});

//删除地址接口
router.post('/addressDel', (req, res, next) => {
  var userId = req.cookies.userId, addressId = req.body.addressId;
  User.update({'userId': userId}, {$pull: {'addressList': {'addressId': addressId}}}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      });
    }
  });
});

//创建订单接口
router.post('/payMent', (req, res, next) => {
  var userId = req.cookies.userId, subTotal = req.body.subTotal, addressId = req.body.addressId;
  User.findOne({'userId': userId}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var address = '', goodsList = [];
      user.addressList.filter((item) => {
        if (item.addressId == addressId) {
          address = item;
        }
      });
      goodsList = user.cartList.filter((item) => item.checked == '1');

      //orderId的生成
      var platForm = '731';
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platForm + r1 + sysDate + r2;


      var order = {
        'orderStatus': '0',
        'orderId': orderId,
        'goodsList': goodsList,
        'orderTotal': subTotal,
        'addressInfo': address,
        'createDate': createDate
      };

      user.orderList.push(order);
      user.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: '0',
            msg: err1.message,
            result: ''
          });
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              'orderId': order.orderId,
              'orderTotal': order.orderTotal
            }
          });
        }
      });
    }
  });
});

//订单查询接口
router.post('/orderDetail', (req, res, next) => {
  var userId = req.cookies.userId, orderId = req.body.orderId;
  User.findOne({'userId': userId}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (user.orderList.length > 0) {
        var orderTotal = 0;
        user.orderList.forEach((item) => {
          if (item.orderId === orderId) {
            orderTotal = item.orderTotal;
          }
        });
        if (orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: orderTotal
          });
        } else {
          res.json({
            status: '10003',
            msg: '用户没有创建订单！',
            result: ''
          });
        }
      } else {
        res.json({
          status: '10002',
          msg: '订单列表为空！',
          result: ''
        });
      }
    }
  });
});

//购物车刷新
router.post('/cartFresh', (req, res, next) => {
  var userId = req.cookies.userId;
  User.update({'userId': userId}, {$pull: {'cartList': {'checked': '1'}}}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      });
    }
  });
});

//获取购物车商品数量
router.get('/cartCount', (req, res, next) => {
  if (req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    User.findOne({'userId': userId}, (err, user) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        if (user) {
          var cartCount = 0, cartList = user.cartList;
          cartList.forEach((item) => {
            cartCount += item.productNum;
          });
          res.json({
            status: '0',
            msg: '',
            result: cartCount
          });
        }
      }
    });
  }
});

module.exports = router;
