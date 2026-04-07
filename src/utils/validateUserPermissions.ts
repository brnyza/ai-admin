// import type { sec_groups } from 'generated/prisma/client'

// type User = {
//   groups: sec_groups[]
// }

// type ValidateUserPermissionsParams = {
//   user: User
//   groups?: string[]
// }

// export function validateUserPermissions({ user, groups }: ValidateUserPermissionsParams) {
//   if (groups && groups.length > 0) {
//     const hasSomeGroup = user.groups.some((group) => groups.includes(group.name as string))

//     if (!hasSomeGroup) return false
//   }
//   return true
// }
