const express = require('express')
const router = express.Router()

// just get the data from a local json for now. In the future, we'll connect to an actual database
const data = {}
data.employees = require('../../data/employees.json')

// instead of doing router.get, router.put ... I can just router.route, and then chain methods for each http verb.
router.route('/')
    .get((req, res) => {
        res.json(data.employees)
    })
    .post((req, res) => {
        res.json({
            "employee_name": req.body.employee_name,
            "employee_salary": req.body.employee_salary,
            "employee_age": req.body.employee_age
        })
    })
    .put((req, res) => {
        res.json({
            "employee_name": req.body.employee_name,
            "employee_salary": req.body.employee_salary,
            "employee_age": req.body.employee_age
        })
    })
    .delete((req, res) => {
        res.json({ "id": req.body.id })
    })

router.route('/:id')
    .get((req, res) => {
        res.json({ "id": req.params.id })
    })

module.exports = router