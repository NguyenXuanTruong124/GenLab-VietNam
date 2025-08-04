const { ACCOUNT, Staff_Assign_Log } = require("../models");
const { Op } = require("sequelize");

async function getNextStaff() {
    const staffs = await ACCOUNT.findAll({
        where: { Role: 'Staff', Status: 'ON' },
        include: [{
            model: Staff_Assign_Log,
            required: false
        }],
        order: [
            [Staff_Assign_Log, 'Last_Assigned', 'ASC'],
            ['Account_ID', 'ASC']
        ]
    });

    if (staffs.length === 0) throw new Error("Không có staff khả dụng.");

    const staff = staffs[0];

    await Staff_Assign_Log.upsert({
        Staff_ID: staff.Account_ID,
        Last_Assigned: new Date()
    });

    return staff.Account_ID;
}

module.exports = { getNextStaff };
