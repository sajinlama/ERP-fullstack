import type { Response , Request } from "express"
import { asyncHandler } from "../../utils/ayncWrapper.js"
import { SupplierSchema } from "../../validators/suppliers.validate.js";
import updateSupplier from "../../services/suppliers/update.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";

const updateSupplers = asyncHandler(async(req:Request, res: Response)=>{
    const validDate = SupplierSchema.parse(req.body);

    const data = await updateSupplier (validDate);

    res.status(200).json(
         new ApiResponse(200, data, "Supplier updated successfully")
    )

})

export default updateSupplers;