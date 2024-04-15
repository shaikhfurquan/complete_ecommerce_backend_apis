function ApiCatchResponse(res, message , error) {
    return res.status(500).json({
        success: false,
        message: message,
        error : error
    });
}

// ApiCatchResponse(res, 'Error updating user profile');
// ApiCatchResponse(res, 'Error sending email');

export { ApiCatchResponse }