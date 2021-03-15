const employeeMapper = (employee) => {
    const { password, ...restProps } = employee;
    return { ...restProps };
}

module.exports = {
    employeeMapper
}