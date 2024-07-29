import React from 'react'
import SignUpForm from './SignUpForm';

const SignUp = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center sm:px-6 lg:px-8'>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto" src="../keelworks-logo.svg"></img>
        <h2 className="mt-12 mr-48 text-center text-3xl leading-9 font-bold text-gray-900">
          Create account!
        </h2>
      </div>
      <SignUpForm />
    </div>
  )
}

export default SignUp;