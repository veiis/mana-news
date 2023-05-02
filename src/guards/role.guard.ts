import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { User } from 'src/modules/users/models/user.model'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private refelector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.refelector.get<string[]>('roles', context.getHandler())

        if (!roles || roles.length === 0) {
            return true
        }

        const req = context.switchToHttp().getRequest()

        const { id } = req.user

        const user = await User.findByPk(id, { attributes: ['role'], raw: true })

        if (!user) return false

        const doHaveRole = roles.includes(user.role)

        return doHaveRole
    }
}