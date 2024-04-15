function ApiSuccessResponse(res, message, user = null, status = 200, success = true) {
    return res.status(status).json({
        success: success ?? true,
        message: message,
        user: user ?? null
    });
}



// ApiSuccessResponse(res, true, 'User details retrieved successfully', userData, 200, additionalData);
// ApiSuccessResponse(res, true, 'Operation completed successfully', null, 200);
// ApiSuccessResponse(res, true, 'Data retrieved successfully', {}, 200);
// ApiSuccessResponse(res, true, 'Custom message', null, 200);


export { ApiSuccessResponse }