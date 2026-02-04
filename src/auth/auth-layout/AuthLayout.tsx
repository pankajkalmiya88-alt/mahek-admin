import LoginPage from "../pages/LoginPage"

const AuthLayout = () => {
  return (
    <div className="min-h-svh w-full">
    {/* <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"> */}
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginPage />
      </div>
    </div>
  )
}

export default AuthLayout