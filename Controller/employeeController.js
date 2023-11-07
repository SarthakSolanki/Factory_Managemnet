const {employee} = require('../modal/factoryModal')

exports.deleteEmployee = async (req, res) => {
    employee.findOneAndDelete({
        userId: req.params.id
    }, function (err, user) {
        if (err) throw err;
    });
    res.redirect("/employee");
}

exports.editEmployee = async(req, res) => {
    let data = await employee.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    res.redirect("/employee");
}