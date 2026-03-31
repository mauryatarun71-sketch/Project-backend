import { userModel, todoModel } from "../module/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const resisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isExist = await userModel.findOne({ email });
        if (isExist) {
            res.json({
                success: false,
                code: 400,
                message: "User allready exist",
                data: isExist,
                error: true
            })
        } else {
            const hasPassword = await bcrypt.hash(password, 10)
            const data = new userModel({ name, email, password: hasPassword });
            const result = await data.save();
            res.json({
                success: true,
                code: 200,
                message: "User resister successfully",
                data: result,
                error: false
            })
        }
    } catch (err) {
        res.json({
            success: false,
            code: 500,
            message: "internal server errort",
            data: isExist,
            error: true
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await userModel.findOne({ email });
        if (data) {
            const isMatch = await bcrypt.compare(password, data.password);
            if (isMatch) {
                const payload = { email: data.email };
                const token = jwt.sign(payload, "jwt_secret", { expiresIn: '1h' });
                console.log(token)
                res.json({
                    success: true,
                    code: 200,
                    message: "login success fully",
                    data: data,
                    token: token,
                    error: false
                })
            } else {
                res.json({
                    success: false,
                    code: 400,
                    message: "invalid credential login failed",
                    data: "",
                    error: true
                })
            }

        } else {
            res.json({
                success: false,
                code: 500,
                message: "user not found",
                data: "",
                error: true
            })

        }



    } catch (error) {
        res.json({
            success: false,
            code: 500,
            message: "user not found",
            data: "",
            error: true
        })
    }
}
export const createTodoController = async (req, res) => {
    try {
        const { name, status } = req.body;
        
        const isExist = await todoModel.findOne({ name });
        if (isExist) {
            res.json({
                success: false,
                code: 400,
                message: "name all ready Exist ",
                data: "",
                error: true
            })
        } else {
            const data = new todoModel({ name, status });
            const result = await data.save();
            res.json({
                success: true,
                code: 400,
                message: "todo created ",
                data: result,
                error: false
            })

        }

    } catch (error) {
        res.json({
            success: false,
            code: 500,
            message: "Internal Server Errror",
            data: "",
            error: true
        })
    }
}
export const getTodoController = async (req, res) => {
    try {
        const result = await todoModel.find();
        res.json({
            success: true,
            code: 200,
            message: "todo get",
            data: result,
            error: false
        })

    } catch (error) {
        res.json({
            success: false,
            code: 500,
            message: "Internal Server Errror",
            data: "",
            error: true
        })
    }
}
export const deleteTodoController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await todoModel.deleteOne({ _id: id });
        res.json({
            success: true,
            code: 200,
            message: "deleted",
            data: result,
            error: false
        })

    } catch (error) {
        res.json({
            success: false,
            code: 500,
            message: "Internal Server Errror",
            data: "",
            error: true
        })
    }
}

export const updateTodoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const result = await todoModel.updateOne({ _id: id }, { $set: { name, status } });
        res.json({
            success: true,
            code: 500,
            message: "updated",
            data: result,
            error: true
        })

    } catch (error) {
        res.json({
            success: false,
            code: 500,
            message: "Internal Server Errror",
            data: "",
            error: true
        })
    }
}



// 
export const userController = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = "name", sortBy = "DESC", name } = req.query;

        // 👉 Convert to number (important)
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const skip = (pageNumber - 1) * limitNumber;
        const order = sortBy === "DESC" ? -1 : 1;

        let search = {};

        // ✅ Apply search only if name exists
        if (name) {
            search.name = {
                $regex: name.toString(),
                $options: "i"
            };
        }

        const result = await todoModel
            .find(search)
            .limit(limitNumber)
            .skip(skip)
            .sort({ [sort]: order });

        const count = await todoModel.countDocuments(search);
        const totalPage = Math.ceil(count / limitNumber);

        res.json({
            code: 200,
            message: "Todo data fetch successfully",
            data: {
                page: pageNumber,
                limit: limitNumber,
                count,
                totalPage,
                result
            },
            error: false
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Internal Server Error",
            error: true
        });
    }
};