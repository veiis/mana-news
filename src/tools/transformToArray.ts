import { isArray } from "class-validator"

export const transformToArray = (values: number[] | string) => {
    if (isArray(values)) return values
    if (typeof values === "string") {
        try {
            const parsed = JSON.parse(values)
            if (isArray(parsed)) return parsed
            else return false
        } catch (err) {
            return false
        }
    }
}