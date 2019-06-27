const router = require('koa-router')();
const controller = require('../controller/c-jobs')


// 首页分页，每次输出10条
router.post('/jobs/list', controller.findJobByPageController)
// 增加
router.post('/jobs/create', controller.JobCreateController)
//  编辑
router.post('/jobs/edit', controller.JobEditController)
// 删除
router.post('/jobs/delete', controller.JobDeleteController)

router.post('/jobs/detail', controller.JobDetailontroller)

router.get('/jobs/categorylist', controller.getAllCategoryController)

router.post('/jobs/submit',controller.submitController)
 
module.exports = router