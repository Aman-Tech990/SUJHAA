
// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Email
export const sendOTP = async (email, name, otp) => {
    try {
        const result = await sendOTPEmail(email, name, otp);

        if (result.success) {
            console.log(`✅ OTP sent to email: ${email}`);
            return {
                success: true,
                message: 'OTP sent to your email successfully'
            };
        } else {
            return {
                success: false,
                message: 'Failed to send OTP email'
            };
        }

    } catch (error) {
        console.error('❌ OTP sending error:', error.message);
        return {
            success: false,
            message: 'Failed to send OTP',
            error: error.message
        };
    }
};

// Verify OTP
export const verifyOTP = (userOTP, storedOTP, otpExpiry) => {
    // Check if OTP expired
    if (new Date() > otpExpiry) {
        return {
            success: false,
            message: 'OTP has expired'
        };
    }

    // Check if OTP matches
    if (userOTP !== storedOTP) {
        return {
            success: false,
            message: 'Invalid OTP'
        };
    }

    return {
        success: true,
        message: 'OTP verified successfully'
    };
};