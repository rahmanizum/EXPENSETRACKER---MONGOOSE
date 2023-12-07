const Expenses = require('../models/expenses');
exports.addExpenses = async (request, response, next) => {
    try {
        const {user} = request;
        const { category, pmethod, amount, date } = request.body;
        const expense = new Expenses({
            userId:user,
            category,
            pmethod,
            amount,
            date,
        })
        await expense.save();
        await user.updateTotal();
        response.status(200).json({ message: 'Data successfully added' });

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'An error occurred' });
    }
}

exports.getExpenses = async (request, response, nex) => {
    try {
        const {user} = request;
        const page = request.query.page;
        const limit = Number(request.query.noitem);
        const offset = (page - 1) * 5;
        await user.updateTotal();
        const expenses = await Expenses.find({"userId":user._id}).skip(offset).limit(limit);
        response.status(200).json({
            expenses: expenses,
            totalexpenses: user.totalexpenses,
            hasMoreExpenses : expenses.length === limit,
            hasPreviousExpenses : page > 1
        });

    } catch (error) {
        console.log(error);
        return response.status(401).json({ message: 'Unauthorized relogin required' });
    }
}
exports.deletebyId = async (request, response, next) => {
    try {
        const dID = request.params.dID;
        const {user} = request;
        const expense = await Expenses.findByIdAndDelete(dID)
        if (expense) {
            await user.updateTotal();
            return response.status(200).json({ message: 'Succeffully deleted' });
            
        } else {
            return response.status(401).json({ message: 'You are not Authorized' });
        }
    } catch (error) {
        console.log(error);
    }
}
exports.getExpensesbyid = async (request, response, nex) => {
    try {
        const eID = request.params.eID;
        const expense = await Expenses.findById(eID)
        response.status(200).json(expense);

    } catch (error) {
        console.log(error);
        return response.status(401).json({ message: 'Unauthorized relogin required' });
    }
}
exports.updateExpensebyid = async (request, response, next) => {
    try {
        const uID = request.params.uID;
        const {user} = request;
        const { category, pmethod, amount, date } = request.body;
        const expense = await Expenses.findByIdAndUpdate(
            {_id:uID,userId:user._id},
            {
                category,
                pmethod,
                amount,
                date
            })
            if (expense) {
                await user.updateTotal();
                return response.status(200).json({ message: "ata succesfully updated" });
            } else {
                return response.status(404).json({ message: "Data not found" });
            }
    } catch (error) {
        console.log(error);
    }
}
