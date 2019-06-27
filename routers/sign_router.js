const router = require('koa-router')();
const controller = require('../controller/c-sign')


/** 
 * 用户分页查询
*/
router.post('/user/list', controller.SignPageController)


/** 
 * 修改密码
*/
router.post('/user/update', controller.updatePasswordController)

/** 
 * 注册路由
*/
router.post('/signup', controller.SignupController)

/** 
 * 登录路由
*/
router.post('/signin', controller.SigninController)

/** 
 * 退出路由
*/
router.post('/signout', controller.SignoutController)

/** 
 * 测试接口
*/
router.get('/msg', function(ctx){
    var da= new Date()
    ctx.body = {
        code:200,
        date:da
    }
})

module.exports = router