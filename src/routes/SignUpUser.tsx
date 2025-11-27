import { useRef, useState } from "react"
import { useNavigate } from "react-router"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import useAuth from "@/hooks/useAuth"

const isErrorInit: { status: boolean, message: string } = { status: false, message: "" }

export default function SignUpUser() {
  const rrNavigate = useNavigate()
  const { signUpUser, setAuthorized, isAuthorized } = useAuth()
  const username = useRef<HTMLInputElement | null>(null)
  const password = useRef<HTMLInputElement | null>(null)
  const [isError, setIsError] = useState(isErrorInit)
  const [isBusy, setIsBusy] = useState(false)

  const handleSignUpUser = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault()
    if (username.current?.value && password.current?.value) {
      setIsBusy(true)
      try {
        await signUpUser(username.current.value, password.current.value)
        isError && setIsError(isErrorInit)
        setAuthorized(true)
        rrNavigate("/", { replace: true })
      } catch (error) {
        setIsError({ status: true, message: "Sign up error, try again" })
        setIsBusy(false)
        password.current.value = ""
      }
    } else {
      setIsError({ status: true, message: "Provide both username and password" })
    }
  }

  const handleClearFields = () => {
    if (username.current != undefined) username.current.value = ""
    if (password.current != undefined) password.current.value = ""
    setIsError(isErrorInit)
    username.current?.focus()
  }

  return (
    <div className="max-w-md mx-auto p-3">
      <h1 className="font-bold mb-3">Sign Up</h1>
      <form action="" onSubmit={handleSignUpUser}>
        <div className="flex flex-col gap-3">
          <Input
            defaultValue=""
            ref={username}
            type="email"
            placeholder="username" />
          <Input
            defaultValue=""
            ref={password}
            type="password"
            placeholder="password" />
          <div className="flex gap-2">
            <Button disabled={isBusy || isAuthorized} className="" onClick={handleSignUpUser} type="submit">Sign Up</Button>
            <Button disabled={isBusy || isAuthorized} className="" onClick={handleClearFields} type="button">Clear</Button>
            <Button disabled={isBusy} className="" onClick={() => rrNavigate(-1)} type="button">Cancel</Button>
          </div>
        </div>
      </form>
      {isError.status && <p className="text-red-400 mt-3">{isError.message}</p>}
      {isAuthorized && <p className="text-green-400 mt-3">You authorized</p>}
    </div>
  )
}
