import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private refelector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.refelector.get<string[]>('roles', context.getHandler())
        if (!roles) {
            return true
        }

        const req = context.switchToHttp().getRequest()
        const user = req.user

        const doHaveRole = roles.includes(user.role)
        return doHaveRole
    }
}