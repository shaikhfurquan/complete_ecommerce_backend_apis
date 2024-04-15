function ApiValidationResponse(res, message, status) {
    return res.status(status).json({
        success: false,
        message: message
    });
}

// ApiValidationResponse(res, 'Validation failed', 400);
// ApiValidationResponse(res, 'Validation failed: Invalid email format', 400);
// ApiValidationResponse(res, 'Validation failed: Username and password are required', 400);

export { ApiValidationResponse }