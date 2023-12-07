
const User = require('../models/users');
const Expenses = require('../models/expenses');
const Awsservice = require('../services/awsservices'); 
exports.getLeaderboardExpenses = async (request, response, next) => {
  try {
    const leaderboard = await User.find({})
    .select('name totalexpenses')
    .sort({ totalexpenses: -1 })
    .limit(15);
    return response.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized - please relogin' });
  }
};
exports.getReport = async (request, response, next) => {
  try {
    const {user} = request;
    const { startDate, endDate } = request.body;
    const filteredData = await Expenses.find({
      userId: user._id,
      date: { $gte: startDate, $lte: endDate }
    }).select('category amount ');
    return response.status(200).json({filteredData,message:"Report succesfully fetched"});
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized - please relogin' });
  }
};
exports.getDownloadURL = async (request, response, next) => {
  try {
    const {user} = request;
    const expenses = await Expenses.find({"userId":user._id})
    const formattedExpenses = expenses.map(expense => {
      return `Category: ${expense.category}
Payment Method: ${expense.pmethod}
Amount: ${expense.amount}
Date: ${expense.date}
`;
    });
    const textData = formattedExpenses.join("\n");
    const filename = `expense-data/user${user._Id}/${user.name}${new Date()}.txt`;
    const URL = await Awsservice.uploadToS3(textData, filename);
    user.downloadUrl.push({
      url:URL,
      createdAt:new Date()
    })
    await user.save();
    response.status(200).json({URL,success:true});
  } catch (error) {
    console.log("Error while creating download link: " + error);
    response.status(500).json({ message: "Unable to generate URL" });
  }
};
exports.getDownloadhistory = async(request,response,next) =>{
  try {
  const {user:{downloadUrl}} = request;
    response.status(200).json({history:downloadUrl});
    
  } catch (error) {
    console.log(error);
    return response.status(401).json({ message: 'Unable to fetch history' });
  }
}

