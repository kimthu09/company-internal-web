// withAuth.tsx
import { ReactNode } from "react";
import { getUser } from "../auth/action";
import NoRole from "@/components/no-role";
import { includesRoles, isManager, isViewUnit } from "../utils";
interface WithAuthProps {
  children: ReactNode;
}

type ComponentType = (props: any) => JSX.Element;

export const withAuth = (
  WrappedComponent: ComponentType,
  allowedCodes: string[],
  exceptCodes?: string[],
  allowedManager?: boolean
) => {
  return async ({ ...props }: any) => {
    const currentUser = await getUser();

    if (allowedManager) {
      if (isManager({ currentUser })) {
        return <WrappedComponent {...props} />;
      }
    }
    if (
      (includesRoles({ currentUser: currentUser, roleCodes: allowedCodes }) &&
        !exceptCodes) ||
      (exceptCodes &&
        !includesRoles({ currentUser: currentUser, roleCodes: exceptCodes }))
    ) {
      return <WrappedComponent {...props} />;
    } else {
      // Redirect or show an error message
      return <NoRole />;
    }
  };
};
