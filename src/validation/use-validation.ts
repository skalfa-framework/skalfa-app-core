"use client"

import { useEffect, useState } from "react"
import { validation, ValidationRules } from "./validation"



// =========================>
// ## Check validation Hook
// =========================>
export const useValidation = (
  value     :  any = "",
  rules     :  ValidationRules = "",
  includes  :  string = "",
  sleep     :  boolean = false
):  [string, (message: string) => void] => {
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (rules && !sleep) {
      const { valid, message } = validation.check({ value, rules })
      setMessage(valid ? "" : message)
    } else {
      setMessage("")
    }
  }, [value, rules, sleep])

  useEffect(() => {
    if (includes) setMessage(includes)
  }, [includes])

  return [message, setMessage]
}
