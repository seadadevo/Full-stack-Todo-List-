import { data, Navigate } from "react-router-dom"
import { ReactNode } from "react";

interface IProps {
    isAllowed: boolean;
    redirectPath: string;
    children: ReactNode;
    data?: unknown;
}

const ProtectedRoute = ({isAllowed, redirectPath, children, data}: IProps) => {
    if (!isAllowed) return  <Navigate to={redirectPath} replace state={data}/>
    return children;
}

export default ProtectedRoute