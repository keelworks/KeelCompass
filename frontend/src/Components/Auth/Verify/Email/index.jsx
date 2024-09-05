
const EmailVerification = () => {

    const verifyEmailAddress = () => {
        // TODO 
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center sm:px-6 lg:px-8'>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img className="mx-auto" src="../keelworks-logo.svg"></img>
                <h2 className="mt-12 mb-12 text-3xl leading-9 font-bold text-gray-900">
                    Verify email address!
                </h2>

                <p className="mb-4">To verify your email we've sent a One Time Password (OTP) to emailplaceHolder</p>

                <label
                    for="verify_email"
                    className="block text-sm text-gray-400">
                    Enter OTP
                </label>
                <input
                    id="otp_verify"
                    name="otp"
                    placeholder=""
                    type="text"
                    required=""
                    className="block mb-4 w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                </input>

                <button
                    type="submit"
                    onClick={verifyEmailAddress}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                    Verify
                </button>

                <p>By creating an account, you agree to the KeelWorks Terms of Service and Privacy Policy.</p>

                <a link="" className="mt-8 font-bold underline block text-sm text-center">Resend OTP</a>

            </div>
        </div>
    )
}

export default EmailVerification; 