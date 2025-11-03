import { Response } from "express"

export const success = (res: Response, data: any, status= 200) => {
    return res.status(status).json({success: true, data});
}

export const failure = (res: Response, message: string, status=500, code?:string) => {
    return res.status(status).json({success: false, error: {message, code}});
}