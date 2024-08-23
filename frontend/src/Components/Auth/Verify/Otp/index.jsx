
const OtpEmailVerification = () => {
    const validateOtpCode = () => {
        // TODO
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center sm:px-6 lg:px-8'>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img className="mx-auto" src="../keelworks-logo.svg"></img>
                <h2 className="mt-12 mb-4 text-3xl leading-9 font-bold text-gray-900">
                    Verify email address!
                </h2>

                <p className="mb-4">Enter the code we just sent to emailplaceHolder</p>

                <div className="grid grid-cols-6 gap-2 justify-center">
                    {[...Array(6)].map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className="w-14 h-16 mb-12 text-center border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    onClick={validateOtpCode}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                    Verify
                </button>

                <div className="mt-8 font-bold text-sm text-center">
                    <a link="" className="underline">Resend OTP</a>
                    <span className="text-red-500">&nbsp;in 60s</span>
                </div>
            </div>
        </div>
    );
}

export default OtpEmailVerification;