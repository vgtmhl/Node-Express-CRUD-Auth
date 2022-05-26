const data = {
    employees: require('../models/employees.json'),
    setEmployees: function (data) { this.employees = data }
}

const getAllEmployees = (req, res) => {
    res.json(data.employees)
}

const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        employee_name: req.body.employee_name,
        employee_salary: req.body.employee_salary,
        employee_age: req.body.employee_age,
    }

    if (Object.values(newEmployee).some(v => v === undefined)) {
        return res.status(400)
    }

    data.setEmployees(...data.employees, newEmployee)
    res.status(201).json(data.employees)
}

const updateEmployee = (req, res) => {
    const employeeToUpdate = data.employees.find(emp => emp.id === +req.body.id)

    if (!employeeToUpdate) { res.status(400).json({ 'message': `No employee with id ${req.body.id}` }) }

    if (req.body.employee_name) { employeeToUpdate.employee_name = req.body.employee_name }
    if (req.body.employee_age) { employeeToUpdate.employee_age = req.body.employee_age }
    if (req.body.employee_salary) { employeeToUpdate.employee_salary = req.body.employee_salary }

    const filteredArray = data.employees.filter(emp => emp.id !== +req.body.id)
    const newArray = [...filteredArray, employeeToUpdate]

    data.setEmployees(newArray.sort((a, b) => { a.id > b.id ? 1 : a.id < b.id ? -1 : 0 }))
    res.json(data.employees)
}

const deleteEmployee = (req, res) => {
    const employeeToDelete = data.employees.find(emp => emp.id === +req.body.id)

    if (!employeeToDelete) { res.status(400).json({ 'message': `No employee with id ${req.body.id}` }) }

    const filteredArray = data.employees.filter(emp => emp.id !== +req.body.id)
    data.setEmployees(filteredArray)

    res.json(data.employees)
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === +req.body.id)

    if (!employee) {
        res.status(400).json({
            'message': `No employee with id ${req.body}`
        })
    }

    res.json(employee)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}